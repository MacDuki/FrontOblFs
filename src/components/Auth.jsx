import { useState } from "react";
import logoW from "../assets/imgs/v4wNoBg.png";
import catIdle from "../assets/pets/cat/IDLE.gif";
import { AuthScreen } from "./AuthScreen.jsx";
import Card from "./Card.jsx";
import { LoginScreen } from "./LoginScreen.jsx";
import { RegisterScreen } from "./RegisterScreen.jsx";
import "./styles/Auth.css";

export default function Auth() {
  const [view, setView] = useState("auth"); // 'auth' | 'login' | 'register'

  return (
    <main className="font-general min-h-screen flex items-center justify-center py-12 px-4 text-gray-100 select-none">
      <Card contentKey={view}>
        {view === "auth" && (
          <AuthScreen
            onLogin={() => setView("login")}
            onRegister={() => setView("register")}
            logoW={logoW}
            catIdle={catIdle}
          />
        )}

        {view === "login" && <LoginScreen onBack={() => setView("auth")} />}

        {view === "register" && (
          <RegisterScreen onBack={() => setView("auth")} />
        )}
      </Card>
    </main>
  );
}
