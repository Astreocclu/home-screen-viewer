import { useState, useRef, useEffect } from 'react';
import { ScreenArea } from '@/lib/aiService';

interface ScreenAreaSelectorProps {
  imageUrl: string;
  onAreasSelected: (areas: ScreenArea[]) => void;
}

/**
 * Component for selecting screen areas on an image
 */
export default function ScreenAreaSelector({
  imageUrl,
  onAreasSelected,
}: ScreenAreaSelectorProps) {
  const [areas, setAreas] = useState<ScreenArea[]>([]);
  const [currentArea, setCurrentArea] = useState<ScreenArea | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('Click and drag to select window areas for screens');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Load the image and set up the canvas
  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    
    if (!image || !canvas) return;
    
    const handleImageLoad = () => {
      // Set canvas dimensions to match the image
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        drawAreas(ctx);
      }
    };
    
    image.onload = handleImageLoad;
    
    // If the image is already loaded, call the handler
    if (image.complete) {
      handleImageLoad();
    }
  }, [imageUrl, areas]);
  
  // Draw all areas on the canvas
  const drawAreas = (ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw the image
    const image = imageRef.current;
    if (image) {
      ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    
    // Draw all existing areas
    areas.forEach((area) => {
      drawArea(ctx, area);
    });
    
    // Draw the current area being created
    if (currentArea) {
      drawArea(ctx, currentArea);
    }
  };
  
  // Draw a single area on the canvas
  const drawArea = (ctx: CanvasRenderingContext2D, area: ScreenArea) => {
    if (area.points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(area.points[0].x, area.points[0].y);
    
    for (let i = 1; i < area.points.length; i++) {
      ctx.lineTo(area.points[i].x, area.points[i].y);
    }
    
    // Close the path if there are at least 3 points
    if (area.points.length >= 3) {
      ctx.closePath();
    }
    
    ctx.strokeStyle = '#00BFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(0, 191, 255, 0.2)';
    ctx.fill();
  };
  
  // Handle mouse down event to start drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create a new area
    const newArea: ScreenArea = {
      id: `area-${Date.now()}`,
      points: [{ x, y }],
    };
    
    setCurrentArea(newArea);
    setIsDrawing(true);
    setStatusMessage('Drag to define the area');
  };
  
  // Handle mouse move event to continue drawing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentArea || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create a rectangular area with the starting point and current point
    const startPoint = currentArea.points[0];
    const updatedArea: ScreenArea = {
      ...currentArea,
      points: [
        startPoint,
        { x, y: startPoint.y },
        { x, y },
        { x: startPoint.x, y },
      ],
    };
    
    setCurrentArea(updatedArea);
    drawAreas(ctx);
  };
  
  // Handle mouse up event to finish drawing
  const handleMouseUp = () => {
    if (!isDrawing || !currentArea) return;
    
    // Add the current area to the list of areas
    if (currentArea.points.length >= 3) {
      setAreas([...areas, currentArea]);
      onAreasSelected([...areas, currentArea]);
      setStatusMessage(`Added area ${areas.length + 1}. Click and drag to add more areas.`);
    }
    
    setCurrentArea(null);
    setIsDrawing(false);
  };
  
  // Handle mouse leave event to cancel drawing
  const handleMouseLeave = () => {
    if (isDrawing) {
      setCurrentArea(null);
      setIsDrawing(false);
      setStatusMessage('Drawing canceled. Click and drag to select window areas for screens.');
    }
  };
  
  // Clear all areas
  const handleClearAreas = () => {
    setAreas([]);
    setCurrentArea(null);
    onAreasSelected([]);
    setStatusMessage('All areas cleared. Click and drag to select window areas for screens.');
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      drawAreas(ctx);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{ maxWidth: '100%' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Image for screen area selection"
          className="hidden"
        />
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          aria-label="Canvas for selecting screen areas"
        />
      </div>
      
      <div className="w-full flex flex-col gap-2">
        <div
          className="p-3 bg-blue-100 text-blue-800 rounded-lg"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleClearAreas}
            className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Clear all selected areas"
          >
            Clear All Areas
          </button>
          
          <div className="text-sm text-gray-600">
            {areas.length} {areas.length === 1 ? 'area' : 'areas'} selected
          </div>
        </div>
      </div>
    </div>
  );
}
