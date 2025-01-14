import baseDir from "../path.js";
import { useState } from "react";

const InputMensaje = () => {
  const [ theme, setTheme ] = useState("");
  const [ message, setMessage ] = useState(""); 
  const [ image, setImage ] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = ()=>{
    fetch(`${baseDir}/api/tweets`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:{
        "theme": theme,
        "message":message,
        "image": image
      }
    })
  }
    return (
      <div>
        <form 
          style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px", alignItems: "start" }}
          onSubmit={handleSubmit}>
          <div>
            <img
              src={userData.avatar}
              width="40"
              height="40"
              alt={userData.email}
              className="rounded-full"
            />
          </div>
  
          <div>
          <div style={{ textAlign: "right" }}>
            <select 
              className="dark:bg-black" 
              style={{ width: "auto", marginBottom: "10px" }}
              onChange={(e)=> setTheme(e.target.value)}
              >
                <option value="" className="text-white">Seleccionar categoría</option>
                <option value="IRL">IRL</option>
                <option value="Política">Política</option>
                <option value="Economía">Economía</option>
                <option value="Deportes">Deportes</option>
            </select>
          </div>
            <textarea
              maxLength={140}
              className="text-white w-full bg-black cursor-text rounded focus:outline-none"
              placeholder="¡¿Qué está pasando?!"
              style={{resize:"none", minHeight:"15vh"}}
              onChange={event => setMessage(event.target.value)}
            ></textarea>
            
            <div className="min-w-full flex justify-end mt-3 align-center">
              <ul className="flex gap-3">
                <li>
                  <div>
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      className="hidden"
                      onChange={(event)=> setImage(event.target.value)}
                    />
                    <label
                      htmlFor="avatar"
                      className="text-white py-2 rounded cursor-pointer"
                    >
                      <i className="fa-solid fa-image"></i>
                    </label>
                  </div>
                </li>
                <li>
                  <div>
                    <input
                      type="file"
                      id="camera"
                      accept="image/*"
                      capture="camera"
                      className="hidden"
                    />
                    <label
                      htmlFor="camera"
                      className="text-white py-2 rounded cursor-pointer"
                    >
                      <i className="fa-solid fa-camera"></i>
                    </label>
                  </div>
                </li>
                <li><i className="fa-solid fa-location-dot"></i></li>
                <button className="bg-white text-black p-2 rounded font-bold">Crear post</button>
              </ul>
            </div>
          </div>
        </form>
        <hr className="border-gray-700 mt-3" />
      </div>
    );
  }
  
  export default InputMensaje;
  