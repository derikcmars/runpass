'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { EventData } from './WizardContainer';

interface Step1BasicInfoProps {
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;
}

interface FieldErrors {
  name?: string;
  url?: string;
  date?: string;
  time?: string;
  location?: string;
  banner?: string;
  description?: string;
}

export default function Step1BasicInfo({ eventData, setEventData }: Step1BasicInfoProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>(JSON.stringify({
    name: '', url: '', date: '', time: '', location: '', banner: '', description: '',
  }));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers de campo ---

  const handleChange = (field: keyof EventData, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro ao começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof EventData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, eventData[field]);
  };

  // --- Sanitização do slug em tempo real ---
  const handleSlugChange = (value: string) => {
    const sanitized = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')       // remove acentos
      .replace(/[^a-z0-9\s-]/g, '')           // remove caracteres especiais
      .replace(/\s+/g, '-')                    // substitui espaços por hífen
      .replace(/-+/g, '-')                     // remove hífens duplicados
      .replace(/^-|-$/g, '')                   // remove hífen no início/fim
      .slice(0, 80);                           // máximo 80 caracteres

    handleChange('url', sanitized);
  };

  // --- Validação de campo individual ---
  const validateField = (field: keyof EventData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'O nome da corrida é obrigatório.';
        if (value.trim().length < 5) return 'O nome deve ter pelo menos 5 caracteres.';
        if (value.length > 120) return 'O nome deve ter no máximo 120 caracteres.';
        return undefined;

      case 'url':
        if (!value.trim()) return 'A URL do evento é obrigatória.';
        if (!/^[a-z0-9-]+$/.test(value)) return 'A URL deve conter apenas letras, números e hífens.';
        return undefined;

      case 'date':
        if (!value) return 'A data do evento é obrigatória.';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(value + 'T00:00:00');
        if (eventDate <= today) return 'A data do evento deve ser futura.';
        return undefined;

      case 'time':
        if (!value) return 'O horário de largada é obrigatório.';
        return undefined;

      case 'location':
        if (!value.trim()) return 'O local do evento é obrigatório.';
        if (value.length > 200) return 'O local deve ter no máximo 200 caracteres.';
        return undefined;

      case 'banner':
        // Validação visual é feita no handleFileChange
        return undefined;

      case 'description':
        if (value.length > 5000) return 'A descrição deve ter no máximo 5000 caracteres.';
        return undefined;

      default:
        return undefined;
    }
  };

  // --- Validação completa da etapa ---
  const validateStep = (): boolean => {
    const fieldsToValidate: (keyof EventData)[] = ['name', 'url', 'date', 'time', 'location'];
    const newErrors: FieldErrors = {};
    let isValid = true;

    for (const field of fieldsToValidate) {
      const error = validateField(field, eventData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    // Valida descrição se preenchida
    if (eventData.description) {
      const descError = validateField('description', eventData.description);
      if (descError) {
        newErrors.description = descError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched({ name: true, url: true, date: true, time: true, location: true, description: !!eventData.description });
    return isValid;
  };

  // --- Upload de banner ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      handleChange('banner', '');
      return;
    }

    // Valida formato
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, banner: 'Formato não suportado. Use JPG, PNG ou WebP.' }));
      return;
    }

    // Valida tamanho (5 MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, banner: 'O arquivo deve ter no máximo 5 MB.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, banner: undefined }));

    // Cria URL do objeto para preview
    const objectUrl = URL.createObjectURL(file);
    handleChange('banner', objectUrl);
  };

  // --- Verifica se há campos obrigatórios preenchidos ---
  const isStepValid = (): boolean => {
    return !!(
      eventData.name.trim() &&
      eventData.url.trim() &&
      eventData.date &&
      eventData.time &&
      eventData.location.trim()
    );
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    setIsNextLoading(true);
    // Simula um pequeno delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsNextLoading(false);

    // Dispara evento customizado para o WizardContainer navegar
    window.dispatchEvent(new CustomEvent('wizard-next'));
  };

  // --- Salvar rascunho ---

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simula um pequeno delay de salvamento
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Rascunho salvo:', eventData);
    setLastSavedData(JSON.stringify(eventData));
    setIsSaving(false);
    alert('Rascunho salvo com sucesso!');
  };

  // --- Verifica se houve alterações desde o último salvamento ---
  const hasUnsavedChanges = (): boolean => {
    return JSON.stringify(eventData) !== lastSavedData;
  };

  // --- Formata data mínima (amanhã) ---
  const getMinDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // --- Contador de caracteres ---
  const descCharCount = eventData.description.length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Etapa 1 de 3: Informações Básicas</h2>

      {/* Nome da Corrida */}
      <div className="mb-4">
        <label htmlFor="nomeCorrida" className="block text-sm font-medium text-gray-700 mb-1">
          Nome da Corrida <span className="text-red-500">*</span>
        </label>
        <input
          id="nomeCorrida"
          type="text"
          value={eventData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Ex.: Meia Maratona Ibirapuera 2026"
          maxLength={120}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && touched.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* URL do Evento */}
      <div className="mb-4">
        <label htmlFor="slugUrl" className="block text-sm font-medium text-gray-700 mb-1">
          URL do evento <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <span className="bg-gray-100 text-gray-600 px-3 py-2 text-sm border-r whitespace-nowrap">
            runpass.com.br/
          </span>
          <input
            id="slugUrl"
            type="text"
            value={eventData.url}
            onChange={(e) => handleSlugChange(e.target.value)}
            onBlur={() => handleBlur('url')}
            placeholder="meia-maratona-ibirapuera-2026"
            maxLength={80}
            className={`flex-1 px-3 py-2 focus:outline-none ${
              errors.url && touched.url ? 'border-red-500' : ''
            }`}
          />
        </div>
        {errors.url && touched.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Apenas letras minúsculas, números e hífens.
        </p>
      </div>

      {/* Data e Horário */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="dataEvento" className="block text-sm font-medium text-gray-700 mb-1">
            Data do Evento <span className="text-red-500">*</span>
          </label>
          <input
            id="dataEvento"
            type="date"
            value={eventData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            min={getMinDate()}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date && touched.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {eventData.date && (
            <p className="mt-1 text-xs text-gray-500">
              Data selecionada: {new Date(eventData.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          )}
          {errors.date && touched.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
        <div>
          <label htmlFor="horarioLargada" className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Largada <span className="text-red-500">*</span>
          </label>
          <input
            id="horarioLargada"
            type="time"
            value={eventData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            onBlur={() => handleBlur('time')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.time && touched.time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {eventData.time && (
            <p className="mt-1 text-xs text-gray-500">
              Largada às {eventData.time}
            </p>
          )}
          {errors.time && touched.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Local */}
      <div className="mb-4">
        <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-1">
          Local <span className="text-red-500">*</span>
        </label>
        <input
          id="local"
          type="text"
          value={eventData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          onBlur={() => handleBlur('location')}
          placeholder="Ex.: Parque Ibirapuera, São Paulo-SP"
          maxLength={200}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.location && touched.location ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.location && touched.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      {/* Banner */}
      <div className="mb-4">
        <label htmlFor="banner" className="block text-sm font-medium text-gray-700 mb-1">
          Banner
        </label>
        <input
          ref={fileInputRef}
          id="banner"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.banner && (
          <p className="mt-1 text-sm text-red-600">{errors.banner}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Formatos: JPG, PNG, WebP. Tamanho máximo: 5 MB. Dimensão recomendada: 1920×600px.
        </p>
        {eventData.banner && !errors.banner && (
          <div className="mt-2">
            <img
              src={eventData.banner}
              alt="Preview do banner"
              className="max-h-40 rounded border"
            />
          </div>
        )}
      </div>

      {/* Descrição */}
      <div className="mb-4">
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={4}
          value={eventData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Descreva o evento..."
          maxLength={5000}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.description && touched.description ? (
            <p className="text-sm text-red-600">{errors.description}</p>
          ) : (
            <span></span>
          )}
          <span className={`text-xs ${descCharCount > 5000 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            {descCharCount}/5000
          </span>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving || !hasUnsavedChanges()}
          className={`px-4 py-2 rounded-md text-white font-medium transition ${
            isSaving || !hasUnsavedChanges()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </span>
          ) : 'Salvar rascunho'}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid() || isNextLoading}
          className={`px-6 py-2 rounded-md text-white font-medium transition ${
            isStepValid() && !isNextLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isNextLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Avançando...
            </span>
          ) : 'Próximo →'}
        </button>
      </div>
    </div>
  );
}