import Spline from '@splinetool/react-spline/next';

export default function splineScene() {
  return (
    <main>
      <Spline
        scene="https://prod.spline.design/ZinDKObkI3UXnNaW/scene.splinecode" 
      />
    </main>
  );
}

  useEffect(() => {
    const loader = new SplineLoader();
    loader.load(url, (splineScene) => {
      group.current.add(splineScene);
    });
  }, [url]);

  return <group ref={group} />;

