"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FaTrash, FaImage } from "react-icons/fa"
import api from "@/lib/api"
import { toast } from 'react-hot-toast'
import { Modal } from "@/components/ui/modal"

export default function EditProject() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        images: []
    })
    const [newImages, setNewImages] = useState([])
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        imageIndex: null,
        isExisting: true // mevcut resim mi yoksa yeni resim mi
    })

    useEffect(() => {
        if (params.id) {
            fetchProject()
        }
    }, [params.id])

    const fetchProject = async () => {
        try {
            const response = await api.get(`/projects/${params.id}`)
            setFormData(response.data)
        } catch (error) {
            console.error('Proje yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            setNewImages(prev => [...prev, ...files])
            toast.success(`${files.length} adet resim eklendi`)
        }
    }

    const handleRemoveExistingImage = async (index) => {
        setModalConfig({
            isOpen: true,
            imageIndex: index,
            isExisting: true
        })
    }

    const handleRemoveNewImage = (index) => {
        setModalConfig({
            isOpen: true,
            imageIndex: index,
            isExisting: false
        })
    }

    const handleConfirmDelete = async () => {
        const { imageIndex, isExisting } = modalConfig

        if (isExisting) {
            const toastId = toast.loading('Resim siliniyor...')
            try {
                const imageToDelete = formData.images[imageIndex]
                const response = await api.delete(`/projects/${params.id}/images`, {
                    data: { imagePath: imageToDelete }
                })

                if (response.data.message === 'Resim başarıyla silindi') {
                    setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== imageIndex)
                    }))
                    
                    toast.success('Resim başarıyla silindi', { id: toastId })
                }
            } catch (error) {
                toast.error(
                    'Resim silinirken bir hata oluştu: ' + 
                    (error.response?.data?.message || error.message),
                    { id: toastId }
                )
            }
        } else {
            setNewImages(prev => prev.filter((_, i) => i !== imageIndex))
            toast.success('Resim kaldırıldı')
        }

        setModalConfig({ isOpen: false, imageIndex: null, isExisting: true })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        const toastId = toast.loading('Proje güncelleniyor...')
        try {
            await api.put(`/projects/${params.id}`, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                images: formData.images
            })

            if (newImages.length > 0) {
                toast.loading('Resimler yükleniyor...', { id: toastId })
                const imageFormData = new FormData()
                newImages.forEach(file => {
                    imageFormData.append('images', file)
                })

                await api.post(`/projects/${params.id}/images`, imageFormData)
            }

            toast.success('Proje başarıyla güncellendi', { id: toastId })

            setTimeout(() => {
                router.push('/dashboard/projects')
            }, 1000)
        } catch (error) {
            toast.error(
                'Proje güncellenirken bir hata oluştu: ' + 
                (error.response?.data?.message || error.message),
                { id: toastId }
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-gray-600">Yükleniyor...</div>
        </div>
    }

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Proje Düzenle</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Proje Adı</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Açıklama</label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Konum</label>
                                <Input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Mevcut Resimler */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mevcut Resimler</label>
                                {formData.images && formData.images.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-4">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img 
                                                    src={`http://localhost:5000${image}`}
                                                    alt={`Resim ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(index)}
                                                        className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Henüz resim eklenmemiş</p>
                                )}
                            </div>

                            {/* Yeni Resimler */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Yeni Resimler</label>
                                {newImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        {newImages.map((file, index) => (
                                            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img 
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Yeni Resim ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewImage(index)}
                                                        className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center justify-center w-full">
                                    <label className="w-full flex flex-col items-center justify-center h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FaImage className="w-8 h-8 mb-4 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Resim yüklemek için tıklayın</span>
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gray-900 hover:bg-gray-800 text-white"
                                    disabled={saving}
                                >
                                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, imageIndex: null, isExisting: true })}
                onConfirm={handleConfirmDelete}
                title="Resmi Sil"
                message="Bu resmi silmek istediğinize emin misiniz?"
                confirmText="Sil"
                cancelText="İptal"
            />
        </>
    )
}