'use client'
import { useState } from 'react'
import { Upload, FileText, Settings, LayoutGrid } from 'lucide-react'

const WORKFLOW_TYPES = {
  TEXT_TO_ASSET: 'text-to-asset',
  BRAND_BASED: 'brand-based',
  DOMAIN_SET: 'domain-set',
  CONVERSION: 'conversion'
}

const DOMAIN_CATEGORIES = [
  'Healthcare',
  'E-commerce',
  'Wellness',
  'Gaming',
  'Finance',
  'Education',
  'Technology',
  'Travel'
]

const ASSET_TYPES = [
  'Icon',
  'Button',
  'Header',
  'Navigation Menu',
  'Card',
  'Banner',
  'Form Element'
]

export default function AssetGenerator() {
  const [workflowType, setWorkflowType] = useState(null)
  const [textPrompt, setTextPrompt] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [brandColors, setBrandColors] = useState({ primary: '', secondary: '', accent: '' })
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedAssets, setGeneratedAssets] = useState([])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const generateAssets = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: textPrompt,
          workflowType,
          assetType: selectedAssetType,
          domain: selectedDomain,
          brandColors
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()
      setGeneratedAssets(data.assets)
    } catch (error) {
      console.error('Generation failed:', error)
      alert(error.message || 'Failed to generate assets. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Workflow Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(WORKFLOW_TYPES).map(([key, value]) => (
          <div
            key={key}
            onClick={() => setWorkflowType(value)}
            className={`
              p-6 rounded-lg shadow-sm cursor-pointer transition-all
              ${workflowType === value 
                ? 'bg-blue-50 border-2 border-blue-500' 
                : 'bg-white border-2 border-gray-200 hover:border-blue-300'}
            `}
          >
            <div className="text-center space-y-3">
              {key === 'TEXT_TO_ASSET' && <FileText className="w-10 h-10 mx-auto text-blue-600" />}
              {key === 'BRAND_BASED' && <Settings className="w-10 h-10 mx-auto text-blue-600" />}
              {key === 'DOMAIN_SET' && <LayoutGrid className="w-10 h-10 mx-auto text-blue-600" />}
              {key === 'CONVERSION' && <Upload className="w-10 h-10 mx-auto text-blue-600" />}
              <h3 className="font-medium text-gray-900">{key.replace(/_/g, ' ')}</h3>
            </div>
          </div>
        ))}
      </div>

      {workflowType && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
          {/* Input Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              rows="4"
              placeholder="Describe what you want to generate..."
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
            />
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={selectedAssetType}
              onChange={(e) => setSelectedAssetType(e.target.value)}
            >
              <option value="">Select Asset Type</option>
              {ASSET_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generateAssets}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium
                     disabled:bg-gray-400 hover:bg-blue-700 transition-colors
                     flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Generating...</span>
              </>
            ) : (
              'Generate Assets'
            )}
          </button>
        </div>
      )}

      {/* Generated Assets Display */}
      {generatedAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedAssets.map((asset, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden">
              <div className="aspect-square w-full relative">
                <img 
                  src={asset.url} 
                  alt={`Generated ${asset.type} ${index + 1}`}
                  className="object-contain w-full h-full p-4"
                />
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{asset.type}</span>
                  <span className="text-green-600 font-medium">
                    {(asset.accessibilityScore * 100).toFixed(0)}% Accessible
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
