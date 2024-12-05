import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    // Prepare the prompt for Recraft API
    const enhancedPrompt = `Create an accessible ${assetType} with the following requirements:
    - High contrast (minimum 4.5:1 ratio)
    - Clear visual hierarchy
    - Distinct shapes and patterns
    - Color-blind friendly
    Description: ${prompt}`

    // Call Recraft API
    const response = await fetch('https://api.recraft.ai/v2/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RECRAFT_API_KEY}`
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        // Add any other Recraft-specific parameters here
        negative_prompt: "blurry, low contrast, confusing layout",
        width: 512,
        height: 512,
        num_images: 1
      })
    })

    const recraftResponse = await response.json()
    
    // Transform Recraft response into our format
    const assets = recraftResponse.images.map(image => ({
      url: image.url,
      type: assetType,
      accessibilityScore: 0.95 // You might want to implement actual accessibility scoring
    }))

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Asset generation failed' },
      { status: 500 }
    )
  }
}
