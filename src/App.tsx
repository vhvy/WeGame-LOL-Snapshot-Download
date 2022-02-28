import { useState } from 'react';
import Index from "@/views/Index/index";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Index />
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}

export default App
