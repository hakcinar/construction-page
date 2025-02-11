"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaEdit, FaTrash, FaMapMarkerAlt, FaCalendar, FaProjectDiagram } from "react-icons/fa"
import api from "@/lib/api"
import { useParams } from 'next/navigation'
import { Modal } from "@/components/ui/modal"
import { toast } from "react-hot-toast"

export default function ProjectDetail() {
    const router = useRouter()
    const params = useParams()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false
    })

    useEffect(() => {
        if (params.id) {
            fetchProject()
        }
    }, [params.id])

    const fetchProject = async () => {
        try {
            const response = await api.get(`/projects/${params.id}`)
            console.log('Proje Detayı:', response.data)
            setProject(response.data)
        } catch (error) {
            console.error('Proje detayı yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = () => {
        setDeleteModal({ isOpen: true })
    }

    const handleConfirmDelete = async () => {
        try {
            const loadingToast = toast.loading('Proje siliniyor...')
            
            await api.delete(`/projects/${params.id}`)
            
            toast.success('Proje başarıyla silindi', {
                id: loadingToast,
                duration: 2000
            })

            setTimeout(() => {
                router.push('/dashboard/projects')
            }, 2000)
        } catch (error) {
            toast.error(
                'Proje silinirken bir hata oluştu: ' + 
                (error.response?.data?.message || error.message),
                { duration: 3000 }
            )
        } finally {
            setDeleteModal({ isOpen: false })
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-gray-600">Yükleniyor...</div>
        </div>
    }

    if (!project) {
        return <div>Proje bulunamadı</div>
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => router.push(`/dashboard/projects/${params.id}/edit`)}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            <FaEdit className="mr-2 h-4 w-4" />
                            Düzenle
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                        >
                            <FaTrash className="mr-2 h-4 w-4" />
                            Sil
                        </Button>
                    </div>
                </div>

                <Card className="bg-white overflow-hidden">
                    <CardContent className="p-0">
                        {project.images && project.images.length > 0 ? (
                            <div className="space-y-4">
                                <div className="h-[400px]">
                                    <img 
                                        src={`http://localhost:5000${project.images[0]}`}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {project.images.length > 1 && (
                                    <div className="px-6 pb-6">
                                        <div className="grid grid-cols-4 gap-4">
                                            {project.images.slice(1).map((image, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                                    <img 
                                                        src={`http://localhost:5000${image}`}
                                                        alt={`${project.title} - ${index + 2}`}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="px-6 pb-6 space-y-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Proje Detayları</h2>
                                        <p className="mt-2 text-gray-600 leading-relaxed">{project.description}</p>
                                    </div>

                                    <div className="flex items-center space-x-6 text-gray-500">
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                                            <span className="text-base">{project.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendar className="h-5 w-5 mr-2" />
                                            <span className="text-base">{new Date(project.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                                <FaProjectDiagram className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false })}
                onConfirm={handleConfirmDelete}
                title="Projeyi Sil"
                message="Bu projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </>
    )
} 