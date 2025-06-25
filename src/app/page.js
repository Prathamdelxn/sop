
import Link from "next/link";

// Button Component
const ActionButton = ({ href, children, variant = "blue" }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25",
    green: "bg-green-600 hover:bg-green-700 hover:shadow-green-500/25"
  };

  return (
    <Link
      href={href}
      className={`block w-full ${colors[variant]} text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-medium`}
    >
      {children}
    </Link>
  );
};

// Card Component
const WelcomeCard = ({ children }) => (
  <div className="text-center bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/20 transform transition-all duration-500 hover:scale-105">
    {children}
  </div>
);

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/Images/Backg.png')" }}
    >
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/70 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-green-400/60 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-purple-400/80 rounded-full animate-bounce"></div>

      <WelcomeCard>
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          Welcome to Our App
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          Your journey starts here
        </p>

        <div className="space-y-4">
          <div className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
            <ActionButton href="/login" variant="blue">
              Login
            </ActionButton>
          </div>

          <div className="animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <ActionButton href="/signup" variant="green">
              Sign Up
            </ActionButton>
          </div>
        </div>
      </WelcomeCard>
    </div>
  );
}