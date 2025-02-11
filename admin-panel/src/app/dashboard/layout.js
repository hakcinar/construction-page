"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"
import { IoNotificationsOutline } from "react-icons/io5"
import api from "@/lib/api"

export default function DashboardLayout({ children }) {
    const router = useRouter()
    const [unreadMessages, setUnreadMessages] = useState(0)

    useEffect(() => {
        // Token kontrolü
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/')
        }

        // Okunmamış mesajları kontrol et
        const checkUnreadMessages = async () => {
            try {
                const response = await api.get('/contacts')
                const unread = response.data.filter(message => !message.isRead).length
                setUnreadMessages(unread)
            } catch (error) {
                console.error('Mesaj kontrolü hatası:', error)
            }
        }

        checkUnreadMessages()
        // Her 5 dakikada bir kontrol et
        const interval = setInterval(checkUnreadMessages, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [router])

    const handleLogout = async () => {
        try {
            await authApi.logout()
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
            localStorage.removeItem('token')
            router.push('/')
        }
    }

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span 
                                onClick={() => router.push('/dashboard')}
                                className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                            >
                                Yapı İnşaat
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            {/* Bildirim İconu */}
                            <div className="relative flex items-center justify-center">
                                <button 
                                    className="p-1.5 text-gray-600 hover:text-gray-900 focus:outline-none rounded-full hover:bg-gray-100"
                                    onClick={() => router.push('/dashboard/messages')}
                                >
                                    <IoNotificationsOutline className="w-6 h-6" />
                                    {unreadMessages > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </button>
                            </div>
                            
                            {/* Çıkış Butonu */}
                            <Button 
                                variant="ghost"
                                onClick={handleLogout}
                                className="bg-gray-900 hover:bg-gray-800 text-white"
                            >
                                Çıkış Yap
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
} 