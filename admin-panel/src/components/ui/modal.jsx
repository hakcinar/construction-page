import { useEffect } from 'react'
import { Button } from './button'

export function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Tamam', cancelText = 'İptal' }) {
    useEffect(() => {
        // Modal açıkken scroll'u engelle
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-6">
                {/* Başlık */}
                <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                </h3>

                {/* Mesaj */}
                <p className="text-gray-600">
                    {message}
                </p>

                {/* Butonlar */}
                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
} 