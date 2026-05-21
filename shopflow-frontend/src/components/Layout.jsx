import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">ShopFlow</h3>
              <p className="text-muted text-sm leading-relaxed">
                Compre com proposito. Produtos de qualidade com uma experiencia fluida e consciente.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm text-muted hover:text-primary transition-colors">
                    Produtos
                  </a>
                </li>
                <li>
                  <a href="/orders" className="text-sm text-muted hover:text-primary transition-colors">
                    Pedidos
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="text-sm text-muted">contato@shopflow.com</li>
                <li className="text-sm text-muted">(11) 99999-9999</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} ShopFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
