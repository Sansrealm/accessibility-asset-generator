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
  const [generatedAssets, setGene
