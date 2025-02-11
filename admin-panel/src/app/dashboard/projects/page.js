"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaMapMarkerAlt, 
    FaRegClock, 
    FaProjectDiagram 
} from "react-icons/fa"
import api from "@/lib/api"
import { Modal } from "@/components/ui/modal"
import { toast } from "react-hot-toast"

export default function ProjectsPage() {
    const router = useRouter()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        projectId: null
    })

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects')
            console.log('Projeler:', response.data) // Projeleri görüntüle
            setProjects(response.data)
        } catch (error) {
            console.error('Projeler yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        setDeleteModal({
            isOpen: true,
            projectId: id
        })
    }

    const handleConfirmDelete = async () => {
        try {
            const loadingToast = toast.loading('Proje siliniyor...')
            
            await api.delete(`/projects/${deleteModal.projectId}`)
            
            toast.success('Proje başarıyla silindi', {
                id: loadingToast,
                duration: 2000
            })
            
            fetchProjects() // Listeyi yenile
        } catch (error) {
            toast.error(
                'Proje silinirken bir hata oluştu: ' + 
                (error.response?.data?.message || error.message),
                { duration: 3000 }
            )
        } finally {
            setDeleteModal({ isOpen: false, projectId: null })
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-gray-600">Yükleniyor...</div>
        </div>
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
                    <Button
                        onClick={() => router.push('/dashboard/projects/new')}
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                    >
                        <FaPlus className="mr-2 h-4 w-4" />
                        Yeni Proje
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card 
                            key={project._id} 
                            className="bg-white hover:shadow-lg transition-all duration-200 cursor-pointer"
                            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
                        >
                            <CardContent className="p-0">
                                {/* Proje Resmi */}
                                <div className="relative h-56 bg-gray-100">
                                    {project.images && project.images.length > 0 ? (
                                        <img 
                                            src={`http://localhost:5000${project.images[0]}`}
                                            alt={project.title}
                                            className="w-full h-full object-cover rounded-t-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FaProjectDiagram className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/dashboard/projects/${project._id}/edit`)
                                            }}
                                            className="bg-white hover:bg-gray-100 text-gray-600 rounded-full w-8 h-8 p-0"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(project._id)
                                            }}
                                            className="bg-white hover:bg-red-50 text-red-600 rounded-full w-8 h-8 p-0"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Proje Detayları */}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h2>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{project.description}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                                            <span className="truncate max-w-[150px]">{project.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaRegClock className="h-4 w-4 mr-1" />
                                            <span>{new Date(project.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full">
                            <Card className="bg-white">
                                <CardContent className="flex flex-col items-center justify-center p-12">
                                    <FaProjectDiagram className="h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-gray-500 mb-4 text-center">Henüz hiç proje eklenmemiş</p>
                                    <Button
                                        onClick={() => router.push('/dashboard/projects/new')}
                                        className="bg-gray-900 hover:bg-gray-800 text-white"
                                    >
                                        <FaPlus className="mr-2 h-4 w-4" />
                                        İlk Projeyi Ekle
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, projectId: null })}
                onConfirm={handleConfirmDelete}
                title="Projeyi Sil"
                message="Bu projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
            />
        </>
    )
}