export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/80 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400">
            © {new Date().getFullYear()} Luminary. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

