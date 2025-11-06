import sys
import json
import re
from textblob import TextBlob
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from collections import Counter
import math

# Download required NLTK data
try:
    nltk.data.find('vader_lexicon')
    nltk.data.find('punkt')
    nltk.data.find('stopwords')
except LookupError:
    nltk.download('vader_lexicon')
    nltk.download('punkt')
    nltk.download('stopwords')

class AdvancedEmotionDetector:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))

        # Comprehensive emotion lexicons with intensity scores
        self.emotion_lexicons = {
            'joy': {
                'high': ['ecstatic', 'thrilled', 'delighted', 'overjoyed', 'blissful', 'euphoric', 'exuberant', 'radiant'],
                'medium': ['happy', 'joyful', 'cheerful', 'glad', 'pleased', 'content', 'satisfied', 'grateful', 'excited', 'amused'],
                'low': ['okay', 'fine', 'good', 'alright', 'decent']
            },
            'sadness': {
                'high': ['devastated', 'heartbroken', 'desperate', 'miserable', 'agonizing', 'tormented', 'depressed', 'hopeless'],
                'medium': ['sad', 'unhappy', 'sorrowful', 'melancholy', 'gloomy', 'disappointed', 'regretful', 'grieving'],
                'low': ['down', 'blue', 'low', 'disheartened', 'discouraged']
            },
            'anger': {
                'high': ['furious', 'enraged', 'livid', 'infuriated', 'outraged', 'incensed', 'wrathful', 'vicious'],
                'medium': ['angry', 'mad', 'irritated', 'annoyed', 'frustrated', 'agitated', 'hostile', 'resentful'],
                'low': ['bothered', 'irked', 'peeved', 'miffed', 'cross']
            },
            'fear': {
                'high': ['terrified', 'petrified', 'horrified', 'panic-stricken', 'paralyzed', 'hysterical'],
                'medium': ['afraid', 'scared', 'frightened', 'anxious', 'nervous', 'apprehensive', 'worried', 'uneasy'],
                'low': ['concerned', 'uneasy', 'wary', 'cautious']
            },
            'surprise': {
                'high': ['astonished', 'flabbergasted', 'stunned', 'shocked', 'dumbfounded', 'thunderstruck'],
                'medium': ['surprised', 'amazed', 'startled', 'astonished', 'taken aback', 'bewildered'],
                'low': ['caught off guard', 'unexpected', 'sudden']
            },
            'disgust': {
                'high': ['repulsed', 'revolted', 'nauseated', 'sickened', 'abhorrent', 'loathsome'],
                'medium': ['disgusted', 'repelled', 'aversion', 'distaste', 'revulsion', 'grossed out'],
                'low': ['uncomfortable', 'offended', 'put off']
            },
            'anticipation': {
                'high': ['eager', 'enthusiastic', 'impatient', 'keen', 'avid', 'zealous'],
                'medium': ['excited', 'expectant', 'hopeful', 'optimistic', 'enthusiastic'],
                'low': ['interested', 'curious', 'intrigued']
            },
            'trust': {
                'high': ['confident', 'faithful', 'loyal', 'dependable', 'reliable', 'steadfast'],
                'medium': ['trusting', 'believing', 'faithful', 'loyal', 'committed'],
                'low': ['reliable', 'dependable', 'trustworthy']
            },
            'calm': {
                'high': ['serene', 'tranquil', 'peaceful', 'composed', 'placid', 'unperturbed'],
                'medium': ['calm', 'relaxed', 'composed', 'collected', 'poised', 'steady'],
                'low': ['content', 'at ease', 'comfortable']
            },
            'neutral': {
                'high': [],
                'medium': ['neutral', 'indifferent', 'apathetic', 'detached', 'unemotional'],
                'low': ['okay', 'fine', 'average', 'normal', 'standard']
            }
        }

        # Intensifiers and diminishers
        self.intensifiers = ['very', 'really', 'so', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely', 'utterly', 'highly']
        self.diminishers = ['slightly', 'somewhat', 'a bit', 'kind of', 'sort of', 'fairly', 'quite', 'rather']

        # Negation words
        self.negations = ['not', 'no', 'never', 'none', 'nothing', 'nobody', 'nowhere', 'neither', 'nor', 'cannot', 'cant', 'wont', 'dont', 'doesnt', 'didnt', 'isnt', 'arent', 'wasnt', 'werent']

        # Contextual modifiers
        self.question_words = ['what', 'why', 'how', 'when', 'where', 'who', 'which', '?']
        self.exclamation_patterns = [r'!+', r'!!!+', r'wow', r'oh my', r'oh god', r'oh no']

    def preprocess_text(self, text):
        """Advanced text preprocessing"""
        # Convert to lowercase
        text = text.lower()

        # Handle contractions
        contractions = {
            "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is",
            "it's": "it is", "we're": "we are", "they're": "they are", "i've": "i have",
            "you've": "you have", "we've": "we have", "they've": "they have",
            "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
            "we'll": "we will", "they'll": "they will", "i'd": "i would", "you'd": "you would",
            "he'd": "he would", "she'd": "she would", "we'd": "we would", "they'd": "they would",
            "can't": "cannot", "won't": "will not", "shan't": "shall not", "shouldn't": "should not",
            "mustn't": "must not", "needn't": "need not", "oughtn't": "ought not"
        }

        for contraction, expansion in contractions.items():
            text = text.replace(contraction, expansion)

        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    def detect_negation_context(self, text):
        """Detect negation and its scope"""
        words = word_tokenize(text)
        negation_indices = []

        for i, word in enumerate(words):
            if word in self.negations:
                # Find scope of negation (typically 3-5 words after)
                start = max(0, i - 2)
                end = min(len(words), i + 5)
                negation_indices.extend(range(start, end))

        return set(negation_indices)

    def calculate_emotion_scores(self, text):
        """Calculate emotion scores using multiple methods"""
        # Preprocessing
        processed_text = self.preprocess_text(text)
        words = word_tokenize(processed_text)
        sentences = sent_tokenize(processed_text)

        # Detect negation context
        negation_indices = self.detect_negation_context(processed_text)

        # VADER sentiment analysis
        vader_scores = self.sia.polarity_scores(text)

        # TextBlob analysis
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity

        # Emotion scoring
        emotion_scores = {emotion: 0.0 for emotion in self.emotion_lexicons.keys()}
        emotion_counts = {emotion: 0 for emotion in self.emotion_lexicons.keys()}

        # Word-level emotion detection
        for i, word in enumerate(words):
            if word in self.stop_words:
                continue

            # Check for intensifiers/diminishers nearby
            intensity_modifier = 1.0
            word_window = words[max(0, i-2):min(len(words), i+3)]

            for modifier in word_window:
                if modifier in self.intensifiers:
                    intensity_modifier = 1.5
                elif modifier in self.diminishers:
                    intensity_modifier = 0.7

            # Check for negation
            if i in negation_indices:
                intensity_modifier *= -0.8  # Reduce intensity for negation

            # Check emotion lexicons
            for emotion, levels in self.emotion_lexicons.items():
                for level, word_list in levels.items():
                    if word in word_list:
                        base_score = {'high': 1.0, 'medium': 0.7, 'low': 0.4}[level]
                        emotion_scores[emotion] += base_score * intensity_modifier
                        emotion_counts[emotion] += 1

        # Sentence-level analysis
        for sentence in sentences:
            sent_blob = TextBlob(sentence)
            sent_polarity = sent_blob.sentiment.polarity
            sent_subjectivity = sent_blob.sentiment.subjectivity

            # Question analysis
            if any(word in sentence.lower() for word in self.question_words):
                emotion_scores['anticipation'] += 0.3
                emotion_scores['fear'] += 0.1

            # Exclamation analysis
            if re.search(r'!+', sentence):
                emotion_scores['surprise'] += 0.4
                if sent_polarity > 0.3:
                    emotion_scores['joy'] += 0.3
                elif sent_polarity < -0.3:
                    emotion_scores['anger'] += 0.3

        # Normalize scores by word count
        word_count = len([w for w in words if w not in self.stop_words])
        if word_count > 0:
            for emotion in emotion_scores:
                emotion_scores[emotion] /= max(1, word_count / 10)  # Normalize for text length

        # Integrate VADER scores
        compound = vader_scores['compound']
        if compound > 0.5:
            emotion_scores['joy'] += compound * 0.5
            emotion_scores['anticipation'] += compound * 0.3
        elif compound < -0.5:
            emotion_scores['sadness'] += abs(compound) * 0.5
            emotion_scores['anger'] += abs(compound) * 0.3
            emotion_scores['fear'] += abs(compound) * 0.2

        # Subjectivity adjustment
        if subjectivity > 0.7:
            # High subjectivity often indicates strong emotions
            max_score = max(emotion_scores.values())
            for emotion in emotion_scores:
                if emotion_scores[emotion] == max_score:
                    emotion_scores[emotion] *= 1.2

        return emotion_scores, vader_scores, polarity, subjectivity

    def determine_primary_emotion(self, emotion_scores, vader_scores, polarity, subjectivity):
        """Determine the primary emotion with advanced logic"""
        # Find emotions with scores above threshold
        threshold = max(0.1, max(emotion_scores.values()) * 0.3)
        candidate_emotions = {k: v for k, v in emotion_scores.items() if v >= threshold}

        if not candidate_emotions:
            # Fallback to neutral if no clear emotions detected
            return 'neutral', 0.0

        # Sort by score
        sorted_emotions = sorted(candidate_emotions.items(), key=lambda x: x[1], reverse=True)
        primary_emotion, primary_score = sorted_emotions[0]

        # Check for mixed emotions
        if len(sorted_emotions) > 1:
            second_emotion, second_score = sorted_emotions[1]
            ratio = second_score / max(primary_score, 0.001)

            # If second emotion is close to primary, consider mixed emotion
            if ratio > 0.7:
                # Define emotion combinations
                mixed_emotions = {
                    ('joy', 'surprise'): 'excited',
                    ('sadness', 'anger'): 'frustrated',
                    ('fear', 'surprise'): 'shocked',
                    ('joy', 'anticipation'): 'hopeful',
                    ('sadness', 'fear'): 'anxious',
                    ('anger', 'disgust'): 'contempt',
                    ('trust', 'joy'): 'grateful',
                    ('calm', 'trust'): 'confident'
                }

                combo_key = tuple(sorted([primary_emotion, second_emotion]))
                if combo_key in mixed_emotions:
                    primary_emotion = mixed_emotions[combo_key]
                    primary_score = (primary_score + second_score) / 2

        # Contextual adjustments based on VADER and TextBlob
        compound = vader_scores['compound']

        # Very high positive sentiment with high subjectivity
        if compound > 0.8 and subjectivity > 0.8:
            if 'joy' in candidate_emotions or 'anticipation' in candidate_emotions:
                primary_emotion = 'excited'

        # Very negative sentiment with high subjectivity
        elif compound < -0.8 and subjectivity > 0.8:
            if primary_emotion == 'sadness' and 'anger' in candidate_emotions:
                primary_emotion = 'angry'

        # Low subjectivity often indicates calm or neutral
        if subjectivity < 0.3 and abs(compound) < 0.3:
            primary_emotion = 'calm'

        return primary_emotion, primary_score

    def calculate_confidence(self, emotion_scores, primary_emotion, primary_score, vader_scores):
        """Calculate confidence score for the detected emotion"""
        total_score = sum(emotion_scores.values())
        if total_score == 0:
            return 0.0

        # Primary emotion dominance
        dominance = primary_score / total_score

        # VADER consistency
        compound = abs(vader_scores['compound'])
        vader_consistency = min(1.0, compound + 0.3)  # Add baseline confidence

        # Emotion lexicon coverage
        word_coverage = sum(1 for score in emotion_scores.values() if score > 0) / len(emotion_scores)

        # Combined confidence
        confidence = (dominance * 0.4 + vader_consistency * 0.4 + word_coverage * 0.2)

        return min(1.0, confidence)

def detect_emotion(text):
    """
    Advanced emotion detection using multiple NLP techniques
    Returns detailed emotion analysis with primary emotion and confidence
    """
    detector = AdvancedEmotionDetector()

    # Calculate emotion scores
    emotion_scores, vader_scores, polarity, subjectivity = detector.calculate_emotion_scores(text)

    # Determine primary emotion
    primary_emotion, primary_score = detector.determine_primary_emotion(
        emotion_scores, vader_scores, polarity, subjectivity
    )

    # Calculate confidence
    confidence = detector.calculate_confidence(emotion_scores, primary_emotion, primary_score, vader_scores)

    # Map to frontend-compatible emotions
    emotion_mapping = {
        'joy': 'happy',
        'sadness': 'sad',
        'anger': 'angry',
        'fear': 'fear',
        'surprise': 'surprised',
        'disgust': 'disgust',
        'anticipation': 'excited',
        'trust': 'trust',
        'calm': 'calm',
        'neutral': 'neutral',
        'excited': 'excited',
        'frustrated': 'angry',
        'shocked': 'surprised',
        'hopeful': 'excited',
        'anxious': 'fear',
        'contempt': 'angry',
        'grateful': 'happy',
        'confident': 'calm'
    }

    frontend_emotion = emotion_mapping.get(primary_emotion, primary_emotion)

    return {
        'emotion': frontend_emotion,
        'confidence': confidence,
        'primary_score': primary_score,
        'all_emotions': emotion_scores,
        'polarity': polarity,
        'subjectivity': subjectivity,
        'vader_scores': vader_scores,
        'details': {
            'raw_emotion': primary_emotion,
            'emotion_scores': emotion_scores,
            'text_length': len(text),
            'sentence_count': len(sent_tokenize(text))
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)

    text = sys.argv[1]
    result = detect_emotion(text)
    print(json.dumps(result))
