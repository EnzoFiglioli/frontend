import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../data/profile.json";
import { baseDir } from "../path.js";
import { ArrowLeft } from "lucide-react";

const AvatarSelection = ({ onNext, setMainAvatar, mainAvatar, setFormData }) => {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={mainAvatar} 
        alt="avatar" 
        className="rounded-full" 
        style={{ width:"80%", height:"80%" }} 
      />
      <h2 className="text-xl font-semibold mb-4">Elige tu Avatar</h2>
      <div className="flex flex-wrap gap-2">
        {profile.map((i, index) => (
          <img
            key={index}
            src={i.image}
            alt={`avatar-${i.id}`}
            className="w-16 h-16 rounded-full cursor-pointer hover:opacity-75"
            onClick={() => {
              setMainAvatar(i.image);
              setFormData((prev) => ({ ...prev, avatar: i.image }));
            }}
          />
        ))}
      </div>
      <button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4">
        Siguiente
      </button>
    </div>
  );
};

const UsernameForm = ({ formData, setFormData, onNext, onBack }) => (
  <div className="flex flex-col">
    <h2 className="text-xl font-semibold mb-4">Tu Nombre de Usuario</h2>
    <input
      type="text"
      name="username"
      value={formData.username}
      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      className="w-full px-3 py-2 border rounded-lg"
      required
      placeholder="Nombre de Usuario"
    />
    <div className="flex justify-between mt-4">
      <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded-lg">Atrás</button>
      <button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Siguiente</button>
    </div>
  </div>
);

const NameAndLastName = ({ formData, setFormData, onNext, onBack }) => (
  <div className="flex flex-col">
    <h2 className="text-xl font-semibold mb-4">Nombre y Apellido</h2>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      className="w-full px-3 py-2 border rounded-lg"
      required
      placeholder="Nombre"
    />
    <input
      type="text"
      name="lastname"
      value={formData.lastname}
      placeholder="Apellido"
      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
      className="w-full px-3 py-2 border rounded-lg mt-2"
      required
    />
    <div className="flex justify-between mt-4">
      <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded-lg">Atrás</button>
      <button onClick={onNext} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Siguiente</button>
    </div>
  </div>
);

const EmailPasswordForm = ({ formData, setFormData, onSubmit, onBack }) => (
  <div className="flex flex-col">
    <h2 className="text-xl font-semibold mb-4">Correo y Contraseña</h2>
    <input
      type="email"
      name="email"
      placeholder="Correo Electrónico"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      className="w-full px-3 py-2 border rounded-lg"
      required
    />
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      className="w-full px-3 py-2 border rounded-lg mt-2"
      placeholder="Contraseña"
      required
    />
    <input
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      className="w-full px-3 py-2 border rounded-lg mt-2"
      placeholder="Repetir Contraseña"
      required
    />
    <div className="flex justify-between mt-4">
      <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded-lg">Atrás</button>
      <button onClick={onSubmit} className="px-4 py-2 bg-green-500 text-white rounded-lg">Finalizar</button>
    </div>
  </div>
);

export const Register = () => {
  const navigate = useNavigate(); // Ahora está dentro del componente

  const [step, setStep] = useState(1);
  const [mainAvatar, setMainAvatar] = useState("https://cdn0.iconfinder.com/data/icons/superhero-2/256/Batman-512.png");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
    name: "",
    lastname: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log({formData})
    fetch(`${baseDir}/api/usuarios/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.ok) {
          window.location.href = "/dashboard";
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Link to="/" className="absolute top-4 left-4 flex items-center text-black hover:underline">
        <ArrowLeft size={24} className="mr-1" /> Volver
      </Link>
      <div className="p-7 rounded-lg shadow-md w-full max-w-md bg-white">
        {step === 1 && <AvatarSelection onNext={() => setStep(2)} setMainAvatar={setMainAvatar} mainAvatar={mainAvatar} setFormData={setFormData} />}
        {step === 2 && <UsernameForm formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <NameAndLastName formData={formData} setFormData={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <EmailPasswordForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onBack={() => setStep(3)} />}
      </div>
    </div>
  );
};

export default Register;
