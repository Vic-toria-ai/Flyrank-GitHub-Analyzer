export default async function HealthCheck() {
  const response = await fetch("https://api.github.com/zen");
  const userData = await response.text();

  return (
    <div>
      <h1>GitHub Zen</h1>
      <p>{userData}</p>
    </div>
  );
}