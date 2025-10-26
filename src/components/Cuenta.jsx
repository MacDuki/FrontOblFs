import { useDispatch, useSelector } from "react-redux";
import { increment } from "../features/contador.slice.js";
function Cuenta() {
  const valor = useSelector((state) => state.contador.value);
  const dispatch = useDispatch(add);
  function add() {
    dispatch(increment());
  }
  return (
    <>
      <div className="absolute bg-red-600 top-50 left-50 z-50 text-xl">
        <h1>Cuenta Component</h1>
        <p>Valor: {valor}</p>
        <button onClick={() => add()}>Click Me</button>
      </div>
    </>
  );
}

export { Cuenta };
