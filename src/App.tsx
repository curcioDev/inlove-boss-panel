import { HashRouter, Routes, Route } from "react-router-dom";

const App = () => (
  <HashRouter>
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1>In Love Dashboard</h1>
      <p>Teste de funcionamento</p>
      <Routes>
        <Route path="/" element={<div>Dashboard funcionando!</div>} />
        <Route path="/clientes" element={<div>Página de Clientes</div>} />
        <Route path="/produtos" element={<div>Página de Produtos</div>} />
        <Route path="/pedidos" element={<div>Página de Pedidos</div>} />
        <Route path="/consignados" element={<div>Página de Consignados</div>} />
        <Route path="/caixa" element={<div>Página de Caixa</div>} />
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </div>
  </HashRouter>
);

export default App;
