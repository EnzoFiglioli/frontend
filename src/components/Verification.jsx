import { useState } from "react";

const Verification = ({resize}) => {
  const [size, setSize] = useState(()=> resize? resize : "w-6 h-6");
  return (
    <div className={`${resize} ml-2 px-1 py-1 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs`}>
        <i className="fa-solid fa-check"></i>
    </div>
  )
}

export default Verification
