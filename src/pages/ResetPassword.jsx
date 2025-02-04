const ResetPassword = ()=> {
	return (
		<div className="container center reset-password ">
		<form className="form center ">
			<label className="">Introduce tu mail para cambiar tu contraseña</label>
			<input className="" type="email" required placeholder="Aqui va tu mail" />
			<button >Enviar</button>
		</form>
		</div>
		)
}

export default ResetPassword;