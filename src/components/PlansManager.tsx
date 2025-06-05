'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  Star, 
  Calendar, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye,
  Tag,
  X,
  SortAsc,
  SortDesc,
  MoreVertical,
  Download,
  Share2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  deletePlan,
  duplicatePlan,
  toggleFavorite,
  setSearchTerm,
  setFilter,
  setSortBy,
  loadPlan,
  addTag,
  removeTag
} from '@/store/plansSlice';
import { 
  selectFilteredAndSortedPlans, 
  selectSearchTerm, 
  selectFilterBy, 
  selectSortBy,
  selectPlanStats,
  selectAllTags
} from '@/store/selectors';
import type { LifestylePlan } from '@/types/lifestyle';

interface Props {
  onCreateNew: () => void;
  onViewPlan: (plan: LifestylePlan) => void;
  onEditPlan: (plan: LifestylePlan) => void;
}

export default function PlansManager({ onCreateNew, onViewPlan, onEditPlan }: Props) {
  const dispatch = useAppDispatch();
  const plans = useAppSelector(selectFilteredAndSortedPlans);
  const searchTerm = useAppSelector(selectSearchTerm);
  const filterBy = useAppSelector(selectFilterBy);
  const sortBy = useAppSelector(selectSortBy);
  const stats = useAppSelector(selectPlanStats);
  const allTags = useAppSelector(selectAllTags);

  const [showTagModal, setShowTagModal] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDelete = (planId: string) => {
    dispatch(deletePlan(planId));
    setShowDeleteModal(null);
  };

  const handleDuplicate = (planId: string) => {
    dispatch(duplicatePlan(planId));
  };

  const handleToggleFavorite = (planId: string) => {
    dispatch(toggleFavorite(planId));
  };

  const handleAddTag = (planId: string) => {
    if (newTag.trim()) {
      dispatch(addTag({ planId, tag: newTag.trim() }));
      setNewTag('');
      setShowTagModal(null);
    }
  };

  const handleRemoveTag = (planId: string, tag: string) => {
    dispatch(removeTag({ planId, tag }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mis Planes de Estilo de Vida
          </h1>
          <p className="text-xl text-gray-600">
            Gestiona, edita y organiza todos tus planes personalizados
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Con Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withFeedback}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Edit3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar planes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex gap-3">
              <select
                value={filterBy}
                onChange={(e) => dispatch(setFilter(e.target.value as any))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">Todos los planes</option>
                <option value="favorites">Solo favoritos</option>
                <option value="recent">Recientes (7 días)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value as any))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="name">Por nombre</option>
              </select>

              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 cursor-pointer hover:scale-105 transform flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Plan
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border p-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterBy !== 'all' ? 'No se encontraron planes' : 'No hay planes guardados'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? 'Prueba ajustando los filtros o términos de búsqueda'
                  : 'Crea tu primer plan de estilo de vida personalizado'
                }
              </p>
              {(!searchTerm && filterBy === 'all') && (
                <button
                  onClick={onCreateNew}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 cursor-pointer hover:scale-105 transform"
                >
                  Crear Mi Primer Plan
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden">
                {/* Plan Header */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg leading-tight">
                        {plan.name}
                      </h3>
                      <p className="text-purple-100 text-sm mt-1">
                        Para: {plan.userProfile.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(plan.id)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${plan.isFavorite ? 'fill-white text-white' : 'text-white'}`} 
                      />
                    </button>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Profesión: {plan.userProfile.profession}</span>
                      <span>{getTimeAgo(plan.createdAt)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Objetivos: {plan.userProfile.goals.length}</span>
                      <span>Tiempo: {plan.userProfile.timeAvailable}</span>
                    </div>

                    {/* Tags */}
                    {plan.tags && plan.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {plan.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(plan.id, tag)}
                              className="hover:text-purple-900 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {plan.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{plan.tags.length - 3} más
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t">
                      <button
                        onClick={() => onViewPlan(plan)}
                        className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => onEditPlan(plan)}
                        className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDuplicate(plan.id)}
                        className="flex-1 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowTagModal(plan.id)}
                        className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Tag className="w-4 h-4" />
                        Etiquetar
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(plan.id)}
                        className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Plan Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t text-xs text-gray-500">
                  Creado: {formatDate(plan.createdAt)}
                  {plan.updatedAt !== plan.createdAt && (
                    <span className="ml-2">• Actualizado: {formatDate(plan.updatedAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Tag Modal */}
        {showTagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Agregar Etiqueta</h3>
              <input
                type="text"
                placeholder="Nombre de la etiqueta"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(showTagModal)}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddTag(showTagModal)}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Agregar
                </button>
                <button
                  onClick={() => {
                    setShowTagModal(null);
                    setNewTag('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar este plan? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 