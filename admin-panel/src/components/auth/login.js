"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await authApi.login(formData)
            console.log('Login successful:', response)
            router.push('/dashboard')
        } catch (error) {
            console.error('Login failed:', error)
            setError(error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
        } finally {
            setLoading(false)
        }


    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <Card className="w-[400px] bg-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Admin Girişi</CardTitle>
                    <CardDescription className="text-gray-600">
                        Yönetim paneline erişmek için giriş yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Kullanıcı adınız"
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Şifre</label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                            disabled={loading}
                        >
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 