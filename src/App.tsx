import { FormDataProvider } from './context/FormDataContext'
import { AIProvider } from './context/AIContext'
import { ToastProvider } from './context/ToastContext'
import { Header } from './components/layout/Header'
import { InputPanel } from './components/layout/InputPanel'
import { OutputPanel } from './components/layout/OutputPanel'
import { Toast } from './components/ui/Toast'

function App() {
  return (
    <ToastProvider>
      <AIProvider>
        <FormDataProvider>
          <div className="min-h-screen bg-background">
            {/* Subtle grain overlay */}
            <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-grain" />

            <Header />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Side - 45% */}
                <div className="lg:col-span-5 space-y-6">
                  <InputPanel />
                </div>

                {/* Output Side - 55% */}
                <div className="lg:col-span-7 lg:sticky lg:top-8 lg:self-start">
                  <OutputPanel />
                </div>
              </div>
            </main>

            <Toast />
          </div>
        </FormDataProvider>
      </AIProvider>
    </ToastProvider>
  )
}

export default App
