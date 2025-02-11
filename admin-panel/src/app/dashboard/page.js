"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FaProjectDiagram, FaTools, FaEnvelope, FaClock } from 'react-icons/fa'
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalServices: 0,
        newMessages: 0,
        lastUpdate: "Henüz güncelleme yok"
    })
    const [projectData, setProjectData] = useState([])
    const [messageData, setMessageData] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Mevcut endpoint'lerden verileri al
                const [projects, services, contacts] = await Promise.all([
                    api.get('/projects'),
                    api.get('/services'),
                    api.get('/contacts')
                ])

                // İstatistikleri güncelle
                setStats({
                    totalProjects: projects.data.length,
                    totalServices: services.data.length,
                    newMessages: contacts.data.length,
                    lastUpdate: new Date().toLocaleString('tr-TR')
                })

                // Örnek grafik verileri (gerçek verilerle değiştirilecek)
                setProjectData([
                    { name: 'Oca', count: 4 },
                    { name: 'Şub', count: 3 },
                    { name: 'Mar', count: 5 },
                    { name: 'Nis', count: 2 },
                    { name: 'May', count: 7 },
                    { name: 'Haz', count: 6 },
                ])

                setMessageData([
                    { name: 'Pzt', count: 2 },
                    { name: 'Sal', count: 5 },
                    { name: 'Çar', count: 3 },
                    { name: 'Per', count: 4 },
                    { name: 'Cum', count: 6 },
                    { name: 'Cmt', count: 2 },
                    { name: 'Paz', count: 1 },
                ])

            } catch (error) {
                console.error('Dashboard veri çekme hatası:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-gray-600">Yükleniyor...</div>
        </div>
    }

    return (
        <div className="space-y-8">
            {/* İstatistik Kartları */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/projects')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Toplam Proje
                        </CardTitle>
                        <FaProjectDiagram className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalProjects}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Aktif projeler
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Toplam Hizmet
                        </CardTitle>
                        <FaTools className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalServices}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Aktif hizmetler
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Yeni Mesajlar
                        </CardTitle>
                        <FaEnvelope className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.newMessages}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Yeni gelen mesajlar
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Son Güncelleme
                        </CardTitle>
                        <FaClock className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.lastUpdate}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Son güncelleme tarihi
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Son Aktiviteler */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Son Projeler */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-600">Son Eklenen Projeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Örnek proje listesi */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium">Villa Projesi</h3>
                                    <p className="text-sm text-gray-500">Ankara, Çankaya</p>
                                </div>
                                <span className="text-sm text-gray-600">2 gün önce</span>
                            </div>
                            {/* Daha fazla proje... */}
                        </div>
                    </CardContent>
                </Card>

                {/* Son Mesajlar */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-600">Son Gelen Mesajlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Örnek mesaj listesi */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="font-medium">Ahmet Yılmaz</h3>
                                    <p className="text-sm text-gray-500 truncate">Proje hakkında bilgi almak istiyorum...</p>
                                </div>
                                <span className="text-sm text-gray-600">1 saat önce</span>
                            </div>
                            {/* Daha fazla mesaj... */}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Grafikler */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Proje Grafiği */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-600">Aylık Proje Dağılımı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={projectData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#1f2937" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Mesaj Grafiği */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-600">Haftalık Mesaj Trafiği</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={messageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#1f2937" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hızlı Eylemler */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/projects/new')}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <FaProjectDiagram className="h-8 w-8 text-gray-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Yeni Proje Ekle</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/services/new')}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <FaTools className="h-8 w-8 text-gray-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Yeni Hizmet Ekle</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/messages')}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <FaEnvelope className="h-8 w-8 text-gray-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Mesajları Görüntüle</h3>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 