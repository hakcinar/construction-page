"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FaTrash, FaImage } from "react-icons/fa"
import api from "@/lib/api"
import { toast } from 'react-hot-toast'

export default function NewProject() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
    })
    const [images, setImages] = useState([])

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
            setImages(prev => [...prev, ...files])
            toast.success(`${files.length} adet resim eklendi`)
        }
    }

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        toast.success('Resim kaldırıldı')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        const toastId = toast.loading('Proje oluşturuluyor...')
        try {
            // Önce proje bilgilerini gönder
            const response = await api.post('/projects', formData)
            const projectId = response.data._id

            // Eğer resim varsa yükle
            if (images.length > 0) {
                toast.loading('Resimler yükleniyor...', { id: toastId })
                const imageFormData = new FormData()
                images.forEach(file => {
                    imageFormData.append('images', file)
                })

                await api.post(`/projects/${projectId}/images`, imageFormData)
            }

            toast.success('Proje başarıyla oluşturuldu', { id: toastId })

            setTimeout(() => {
                router.push('/dashboard/projects')
            }, 1000)
        } catch (error) {
            toast.error(
                'Proje oluşturulurken bir hata oluştu: ' + 
                (error.response?.data?.message || error.message),
                { id: toastId }
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Yeni Proje</CardTitle>
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

                        {/* Resimler */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Resimler</label>
                            {images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <img 
                                                src={URL.createObjectURL(file)}
                                                alt={`Resim ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
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
                                {saving ? 'Oluşturuluyor...' : 'Oluştur'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 