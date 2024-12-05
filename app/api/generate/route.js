import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    // Validate API key
    const apiKey = process.env.RECRAFT_API_KEY
    if (!apiKey) {
      throw new Error('Recraft API key is not configured')
    }

    // Call Recraft API with proper authorization
    const response = await fetch('https://api.recraft.ai/api/v1/imagine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey // Remove 'Bearer ' prefix if it's already in the key
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}`,
        width: 512,
        height: 512,
        num_images: 1
      })
    })

    console.log('Recraft API response status:', response.status)
    
    const responseData = await response.json()
    console.log('Recraft API response:', responseData)

    if (!response.ok) {
      throw new Error(responseData.error || 'Recraft API request failed')
    }

    // Assuming responseData.output is an array of image URLs
    const assets = (responseData.output || []).map(url => ({
      url,
      type: assetType,
      accessibilityScore: 0.95
    }))

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
