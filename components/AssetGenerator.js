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

    const data = await response.json()
    setGeneratedAssets(data.assets)
  } catch (error) {
    console.error('Generation failed:', error)
  } finally {
    setIsProcessing(false)
  }
}

return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(WORKFLOW_TYPES).map(([key, value]) => (
          <div
            key={key}
            onClick={() => setWorkflowType(value)}
            className={`p-4 border rounded-lg cursor-pointer ${
              workflowType === value ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="text-center">
              {key === 'TEXT_TO_ASSET' && <FileText className="w-8 h-8 mx-auto mb-2" />}
              {key === 'BRAND_BASED' && <Settings className="w-8 h-8 mx-auto mb-2" />}
              {key === 'DOMAIN_SET' && <LayoutGrid className="w-8 h-8 mx-auto mb-2" />}
              {key === 'CONVERSION' && <Upload className="w-8 h-8 mx-auto mb-2" />}
              <h3 className="font-medium">{key.replace(/_/g, ' ')}</h3>
            </div>
          </div>
        ))}
      </div>

      {workflowType && (
        <div className="space-y-4">
          {workflowType === WORKFLOW_TYPES.TEXT_TO_ASSET && (
            <>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Describe the asset you want to generate..."
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedAssetType}
                onChange={(e) => setSelectedAssetType(e.target.value)}
              >
                <option value="">Select Asset Type</option>
                {ASSET_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </>
          )}

          {workflowType === WORKFLOW_TYPES.BRAND_BASED && (
            <>
              <div className="border-2 border-dashed rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 mb-2" />
                  <span>Upload logo (optional)</span>
                </label>
                {preview && (
                  <div className="mt-4">
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Primary Color (hex)"
                  className="p-2 border rounded-lg"
                  value={brandColors.primary}
                  onChange={(e) => setBrandColors({...brandColors, primary: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Secondary Color (hex)"
                  className="p-2 border rounded-lg"
                  value={brandColors.secondary}
                  onChange={(e) => setBrandColors({...brandColors, secondary: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Accent Color (hex)"
                  className="p-2 border rounded-lg"
                  value={brandColors.accent}
                  onChange={(e) => setBrandColors({...brandColors, accent: e.target.value})}
                />
              </div>
            </>
          )}

          {workflowType === WORKFLOW_TYPES.DOMAIN_SET && (
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <option value="">Select Domain</option>
              {DOMAIN_CATEGORIES.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          )}

          {workflowType === WORKFLOW_TYPES.CONVERSION && (
            <div className="border-2 border-dashed rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="asset-upload"
              />
              <label
                htmlFor="asset-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 mb-2" />
                <span>Upload existing asset</span>
              </label>
              {preview && (
                <div className="mt-4">
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
                </div>
              )}
            </div>
          )}

          <button
            onClick={generateAssets}
            disabled={isProcessing}
            className="w-full bg-blue-500 text-white p-3 rounded-lg disabled:bg-gray-300"
          >
            {isProcessing ? 'Generating...' : 'Generate Assets'}
          </button>
        </div>
      )}

      {generatedAssets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generatedAssets.map((asset, index) => (
            <div key={index} className="border rounded-lg p-4">
              <img src={asset.url} alt={`Generated asset ${index + 1}`} className="w-full" />
              <div className="mt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{asset.type}</span>
                  <span className="text-sm text-green-600">
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
