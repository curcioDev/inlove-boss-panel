# In Love Dashboard - Sistema Administrativo

Dashboard administrativo completo para a loja In Love, desenvolvido com React, TypeScript e Vite.

## 🚀 Funcionalidades

- 📊 **Dashboard** - Visão geral com estatísticas em tempo real
- 👥 **Gestão de Clientes** - Cadastro e gerenciamento de clientes
- 📦 **Gestão de Produtos** - Controle de estoque e produtos
- 💰 **Sistema de Caixa** - Controle financeiro e transações
- 📋 **Pedidos** - Gerenciamento de pedidos e consignados
- 🔍 **QR Code Scanner** - Leitura de códigos QR
- 🏷️ **Impressão de Etiquetas** - Sistema de etiquetas para produtos

## 🛠️ Tecnologias

- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes de UI
- **Supabase** - Backend e banco de dados
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Zod** - Validação de dados

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/inlove-boss-panel.git
   cd inlove-boss-panel
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase.

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse o projeto:**
   Abra [http://localhost:8080](http://localhost:8080) no seu navegador.

## 🌐 Deploy no GitHub Pages

### Configuração Automática

1. **Crie um repositório no GitHub** com o nome `inlove-boss-panel`

2. **Conecte seu repositório local:**
   ```bash
   git remote add origin https://github.com/seu-usuario/inlove-boss-panel.git
   git branch -M main
   git push -u origin main
   ```

3. **Configure o GitHub Pages:**
   - Vá para Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

4. **O deploy será automático** a cada push para a branch main

### Deploy Manual

```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

## 📱 Acesso Online

Após o deploy, o site estará disponível em:
`https://seu-usuario.github.io/inlove-boss-panel/`

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run deploy` - Deploy automático para GitHub Pages

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── lib/           # Utilitários e configurações
├── integrations/  # Integrações externas (Supabase)
└── ui/            # Componentes de UI (shadcn/ui)
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido por

In Love - Carandaí, MG
