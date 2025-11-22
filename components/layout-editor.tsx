"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download, Grid, ImageIcon, Move, Trash2, Users, Plus, ChevronLeft, ChevronRight, LayoutTemplate, Filter, X, Type, ArrowLeft, ArrowRight, Settings, Layers, ChevronUp, ChevronDown, Upload } from 'lucide-react'
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface LayoutEditorProps {
  eventId: string
  templateId: string
  initialData?: any
  photos: any[]
}

interface GridConfig {
  rows: number
  cols: number
  gap: number
  padding: number
}

interface TextElement {
  id: string
  type: 'text'
  content: string
  x: number
  y: number
  fontSize: number
  fontWeight: string
  color?: string
}

interface Page {
  id: string
  name: string
  type?: 'grid' | 'welcome' | 'frontPage' | 'lastPage'
  config: GridConfig
  slots: Record<string, any>
  content?: {
    title?: string
    subtitle?: string
    backgroundImage?: string
    overlay?: boolean
    centered?: boolean
    logo?: string
    elements?: TextElement[]
  }
}

interface GlobalConfig {
  header?: {
    text: string
    enabled: boolean
  }
  footer?: {
    text: string
    showPageNumbers: boolean
    enabled: boolean
  }
}

export function LayoutEditor({ eventId, templateId, initialData, photos }: LayoutEditorProps) {
  const [pages, setPages] = useState<Page[]>(() => {
    if (initialData?.pages) return initialData.pages
    
    return [{
      id: "page-1",
      name: "Page 1",
      config: initialData?.config || { rows: 1, cols: 1, gap: 16, padding: 24 },
      slots: initialData?.slots || {}
    }]
  })
  
  const [activePageId, setActivePageId] = useState<string>(pages[0]?.id || "page-1")
  const [people, setPeople] = useState<any[]>([])
  const [draggedItem, setDraggedItem] = useState<{ type: 'photo' | 'person', data: any } | null>(null)
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]) // Added selectedPeople array for multi-select
  const [draggedElement, setDraggedElement] = useState<string | null>(null) // For moving text elements

  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    header: { text: "Wedding Album", enabled: false },
    footer: { text: "", showPageNumbers: true, enabled: false }
  })

  const activePage = pages.find(p => p.id === activePageId) || pages[0]
  const activePageIndex = pages.findIndex(p => p.id === activePageId)

  const filteredPhotos = selectedPeople.length > 0 // Updated filtering logic to support multiple people selection
    ? photos.filter(p => Math.random() > 0.5) // Simulated filtering
    : photos

  useEffect(() => {
    api.events.getPeople(eventId).then(setPeople).catch(console.error)
  }, [eventId])

  const updateActivePage = (updates: Partial<Page> | ((prev: Page) => Partial<Page>)) => {
    setPages(prev => prev.map(page => {
      if (page.id === activePageId) {
        const newValues = typeof updates === 'function' ? updates(page) : updates
        return { ...page, ...newValues }
      }
      return page
    }))
  }

  const updateGridConfig = (updates: Partial<GridConfig>) => {
    updateActivePage(page => ({
      config: { ...page.config, ...updates }
    }))
  }

  const handleDragStart = (item: any, type: 'photo' | 'person') => {
    setDraggedItem({ type, data: item })
  }

  const handleDrop = (row: number, col: number) => {
    if (draggedItem) {
      const slotKey = `${row}-${col}`
      
      const photoData = draggedItem.type === 'person' 
        ? { id: draggedItem.data.id, url: draggedItem.data.thumbnail, isPerson: true }
        : draggedItem.data

      updateActivePage(page => ({
        slots: {
          ...page.slots,
          [slotKey]: photoData
        }
      }))
      
      setDraggedItem(null)
    }
  }

  const handleRemovePhoto = (row: number, col: number) => {
    updateActivePage(page => {
      const newSlots = { ...page.slots }
      delete newSlots[`${row}-${col}`]
      return { slots: newSlots }
    })
  }

  // Renamed from handleUpdateWelcomeContent to handleUpdateContent for broader use
  const handleUpdateContent = (key: string, value: any) => {
    updateActivePage(page => ({
      content: { ...page.content!, [key]: value }
    }))
  }

  // Added functions for managing text elements on frontPage and lastPage
  const handleAddTextElement = () => {
    const newElement: TextElement = {
      id: `el-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: 50, // Initial position in percentage
      y: 50, // Initial position in percentage
      fontSize: 16,
      fontWeight: 'normal'
    }
    
    updateActivePage(page => ({
      content: {
        ...page.content!,
        elements: [...(page.content?.elements || []), newElement]
      }
    }))
  }

  const handleUpdateElement = (elementId: string, updates: Partial<TextElement>) => {
    updateActivePage(page => ({
      content: {
        ...page.content!,
        elements: page.content?.elements?.map(el => 
          el.id === elementId ? { ...el, ...updates } : el
        )
      }
    }))
  }

  const handleDeleteElement = (elementId: string) => {
    updateActivePage(page => ({
      content: {
        ...page.content!,
        elements: page.content?.elements?.filter(el => el.id !== elementId)
      }
    }))
  }

  // Added 'front' and 'last' presets to addNewPage
  const addNewPage = (preset?: 'welcome' | 'single-row' | 'grid' | 'front' | 'last') => {
    const newId = `page-${Date.now()}`
    let config = { rows: 1, cols: 1, gap: 16, padding: 24 }
    let name = `Page ${pages.length + 1}`
    let type: 'grid' | 'welcome' | 'frontPage' | 'lastPage' = 'grid'
    let content = undefined

    if (preset === 'welcome') {
      config = { rows: 1, cols: 1, gap: 0, padding: 0 }
      name = "Welcome Slide"
      type = 'welcome'
      content = {
        title: "Welcome",
        subtitle: "Our Album",
        overlay: true,
        centered: true
      }
    } else if (preset === 'front') {
      config = { rows: 1, cols: 1, gap: 0, padding: 0 }
      name = "Front Page"
      type = 'frontPage'
      content = {
        title: "Album Title",
        subtitle: "Subtitle Here",
        backgroundImage: "",
        logo: "",
        elements: [] // Initialize elements array for front page
      }
    } else if (preset === 'last') {
      config = { rows: 1, cols: 1, gap: 0, padding: 0 }
      name = "Last Page"
      type = 'lastPage'
      content = {
        backgroundImage: "",
        elements: [
          { // Default text element for last page
            id: `el-${Date.now()}`,
            type: 'text',
            content: 'Studio Name\nAddress\nContact Info',
            x: 50,
            y: 50,
            fontSize: 16,
            fontWeight: 'normal'
          }
        ]
      }
    } else if (preset === 'single-row') {
      config = { rows: 1, cols: 3, gap: 16, padding: 24 }
      name = "Row Layout"
    }

    setPages(prev => [...prev, {
      id: newId,
      name,
      type,
      config,
      slots: {},
      content
    }])
    setActivePageId(newId)
  }

  const deleteActivePage = () => {
    if (pages.length <= 1) return
    const newPages = pages.filter(p => p.id !== activePageId)
    setPages(newPages)
    setActivePageId(newPages[Math.max(0, activePageIndex - 1)].id)
  }

  const movePage = (direction: 'left' | 'right') => {
    if (direction === 'left' && activePageIndex > 0) {
      const newPages = [...pages]
      const temp = newPages[activePageIndex]
      newPages[activePageIndex] = newPages[activePageIndex - 1]
      newPages[activePageIndex - 1] = temp
      setPages(newPages)
    } else if (direction === 'right' && activePageIndex < pages.length - 1) {
      const newPages = [...pages]
      const temp = newPages[activePageIndex]
      newPages[activePageIndex] = newPages[activePageIndex + 1]
      newPages[activePageIndex + 1] = temp
      setPages(newPages)
    }
  }

  const movePageToIndex = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return
    const newPages = [...pages]
    const [movedPage] = newPages.splice(fromIndex, 1)
    newPages.splice(toIndex, 0, movedPage)
    setPages(newPages)
    if (pages[fromIndex].id === activePageId) {
      // activePageId remains the same
    }
  }

  const togglePersonSelection = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    )
  }

  const clearPeopleFilter = () => {
    setSelectedPeople([])
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-muted/30 -m-8">
      {/* Left Sidebar - Assets */}
      <div className="w-72 border-r bg-background flex flex-col">
        <Tabs defaultValue="pages" className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="w-full grid grid-cols-2"> {/* Removed People tab from TabsList */}
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pages" className="flex-1 p-0 m-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {pages.map((page, index) => (
                  <div 
                    key={page.id}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer group",
                      activePageId === page.id 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-card hover:bg-accent/50 border-border"
                    )}
                    onClick={() => setActivePageId(page.id)}
                  >
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:text-foreground"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation()
                          movePageToIndex(index, index - 1)
                        }}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <span className="text-[10px] font-mono">{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:text-foreground"
                        disabled={index === pages.length - 1}
                        onClick={(e) => {
                          e.stopPropagation()
                          movePageToIndex(index, index + 1)
                        }}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Updated icon for welcome, frontPage, and lastPage */}
                        {page.type === 'welcome' || page.type === 'frontPage' ? (
                          <LayoutTemplate className="h-3 w-3 text-blue-500" />
                        ) : page.type === 'lastPage' ? (
                          <Type className="h-3 w-3 text-purple-500" />
                        ) : (
                          <Grid className="h-3 w-3 text-green-500" />
                        )}
                        <span className="font-medium text-sm truncate">{page.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {/* Updated page type descriptions */}
                        {page.type === 'welcome' ? 'Cover Page' : page.type === 'frontPage' ? 'Front Cover' : page.type === 'lastPage' ? 'Back Cover' : `${page.config.rows}x${page.config.cols} Grid`}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (pages.length > 1) {
                          const newPages = pages.filter(p => p.id !== page.id)
                          setPages(newPages)
                          if (activePageId === page.id) {
                            setActivePageId(newPages[0].id)
                          }
                        }
                      }}
                      disabled={pages.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="pt-2 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed gap-2 text-xs h-8"
                    onClick={() => addNewPage('front')}
                  >
                    <LayoutTemplate className="h-3 w-3" />
                    Add Front Page
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed gap-2 text-xs h-8"
                    onClick={() => addNewPage('last')}
                  >
                    <Type className="h-3 w-3" />
                    Add Last Page
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed gap-2"
                    onClick={() => addNewPage('grid')}
                  >
                    <Plus className="h-4 w-4" />
                    Add Grid Page
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="photos" className="flex-1 p-0 m-0 flex flex-col">
            {/* Filter indicator */}
            {selectedPeople.length > 0 && (
              <div className="p-2 bg-primary/10 border-b flex items-center justify-between text-xs text-primary font-medium">
                <div className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'} selected
                </div>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={clearPeopleFilter}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Filter by People
                    </Label>
                    {selectedPeople.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={clearPeopleFilter}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {people.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => togglePersonSelection(person.personId)}
                        draggable
                        onDragStart={() => handleDragStart(person, 'person')}
                        className={cn(
                          "relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all group",
                          selectedPeople.includes(person.personId)
                            ? "ring-2 ring-primary shadow-md"
                            : "hover:ring-2 hover:ring-primary/50"
                        )}
                      >
                        <Image
                          src={person.thumbnail || "/placeholder.svg"}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                        {selectedPeople.includes(person.personId) && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white truncate text-center">
                          {person.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Photos {filteredPhotos.length > 0 && `(${filteredPhotos.length})`}
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        draggable
                        onDragStart={() => handleDragStart(photo, 'photo')}
                        className="relative aspect-square rounded-md overflow-hidden cursor-move hover:ring-2 ring-primary transition-all"
                      >
                        <Image
                          src={photo.url || "/placeholder.svg"}
                          alt="Photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
        </Tabs>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                disabled={activePageIndex === 0}
                onClick={() => movePage('left')}
                title="Move Page Left"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                disabled={activePageIndex === 0}
                onClick={() => setActivePageId(pages[activePageIndex - 1].id)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[80px] text-center">
                Page {activePageIndex + 1} / {pages.length}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                disabled={activePageIndex === pages.length - 1}
                onClick={() => setActivePageId(pages[activePageIndex + 1].id)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                disabled={activePageIndex === pages.length - 1}
                onClick={() => movePage('right')}
                title="Move Page Right"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-muted/30">
          <div 
            className="bg-white shadow-lg transition-all duration-300 relative flex flex-col"
            style={{
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '3/2',
              // Adjusted padding for new page types
              paddingTop: globalConfig.header?.enabled ? '40px' : ((activePage.type === 'welcome' || activePage.type === 'frontPage' || activePage.type === 'lastPage') ? 0 : `${activePage.config.padding}px`),
              paddingBottom: globalConfig.footer?.enabled ? '40px' : ((activePage.type === 'welcome' || activePage.type === 'frontPage' || activePage.type === 'lastPage') ? 0 : `${activePage.config.padding}px`),
              paddingLeft: (activePage.type === 'welcome' || activePage.type === 'frontPage' || activePage.type === 'lastPage') ? 0 : `${activePage.config.padding}px`,
              paddingRight: (activePage.type === 'welcome' || activePage.type === 'frontPage' || activePage.type === 'lastPage') ? 0 : `${activePage.config.padding}px`,
            }}
          >
            {globalConfig.header?.enabled && (
              <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center text-sm text-muted-foreground border-b border-transparent hover:border-border/50 transition-colors">
                {globalConfig.header.text}
              </div>
            )}

            {activePage.type === 'frontPage' ? (
              <div 
                className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedItem && draggedItem.type === 'photo') {
                    handleUpdateContent('backgroundImage', draggedItem.data.url)
                    setDraggedItem(null)
                  }
                }}
              >
                {activePage.content?.backgroundImage ? (
                  <img 
                    src={activePage.content.backgroundImage || "/placeholder.svg"} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/20">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Drag photo for background</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />

                <div className="relative z-10 text-center p-8 max-w-2xl w-full">
                  {activePage.content?.logo && (
                    <img src={activePage.content.logo || "/placeholder.svg"} alt="Logo" className="h-16 w-auto mx-auto mb-6" />
                  )}
                  <h1 className="text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                    {activePage.content?.title || "Album Title"}
                  </h1>
                  <p className="text-xl text-white/90 font-light tracking-wide drop-shadow-md">
                    {activePage.content?.subtitle || "Subtitle"}
                  </p>
                </div>
              </div>
            ) : activePage.type === 'lastPage' ? (
              <div 
                className="w-full h-full relative overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedItem && draggedItem.type === 'photo') {
                    handleUpdateContent('backgroundImage', draggedItem.data.url)
                    setDraggedItem(null)
                  }
                }}
              >
                {activePage.content?.backgroundImage ? (
                  <img 
                    src={activePage.content.backgroundImage || "/placeholder.svg"} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10" />
                )}

                {activePage.content?.elements?.map((element) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={() => setDraggedElement(element.id)}
                    onDragOver={(e) => e.preventDefault()} // Prevent default to allow dropping
                    onDrop={(e) => {
                      // This onDrop is not strictly needed for dragging, but good practice
                      e.preventDefault();
                    }}
                    // Modified onDrag to update position more smoothly
                    onDrag={(e: React.DragEvent<HTMLDivElement>) => {
                      if (draggedElement === element.id && e.clientX && e.clientY) {
                        const canvasRect = e.currentTarget.parentElement!.getBoundingClientRect();
                        const x = ((e.clientX - canvasRect.left) / canvasRect.width) * 100;
                        const y = ((e.clientY - canvasRect.top) / canvasRect.height) * 100;
                        handleUpdateElement(element.id, { x, y });
                      }
                    }}
                    onDragEnd={() => setDraggedElement(null)}
                    className="absolute cursor-move group/el"
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      transform: 'translate(-50%, -50%)', // Center the element based on its new coordinates
                      fontSize: `${element.fontSize}px`,
                      fontWeight: element.fontWeight,
                      color: element.color || '#000',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {element.content}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-5 w-5 absolute -top-2 -right-2 opacity-0 group-hover/el:opacity-100 transition-opacity duration-200"
                      onClick={() => handleDeleteElement(element.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : activePage.type === 'welcome' ? (
              <div 
                className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedItem && draggedItem.type === 'photo') {
                    handleUpdateContent('backgroundImage', draggedItem.data.url)
                    setDraggedItem(null)
                  }
                }}
              >
                {activePage.content?.backgroundImage ? (
                  <img 
                    src={activePage.content.backgroundImage || "/placeholder.svg"} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/20">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Drag photo here for background</p>
                    </div>
                  </div>
                )}
                
                {activePage.content?.overlay && (
                  <div className="absolute inset-0 bg-black/40" />
                )}

                <div className={cn(
                  "relative z-10 p-8 max-w-2xl w-full",
                  activePage.content?.centered ? "text-center" : "text-left self-start"
                )}>
                  <h1 className="text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                    {activePage.content?.title || "Welcome"}
                  </h1>
                  <p className="text-xl text-white/90 font-light tracking-wide drop-shadow-md">
                    {activePage.content?.subtitle || "Subtitle"}
                  </p>
                </div>
              </div>
            ) : (
              <div 
                className="w-full h-full grid"
                style={{
                  gridTemplateRows: `repeat(${activePage.config.rows}, 1fr)`,
                  gridTemplateColumns: `repeat(${activePage.config.cols}, 1fr)`,
                  gap: `${activePage.config.gap}px`,
                }}
              >
                {Array.from({ length: activePage.config.rows * activePage.config.cols }).map((_, i) => {
                  const row = Math.floor(i / activePage.config.cols)
                  const col = i % activePage.config.cols
                  const key = `${row}-${col}`
                  const photo = activePage.slots[key]

                  return (
                    <div
                      key={key}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(row, col)}
                      className={cn(
                        "relative bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg transition-colors flex items-center justify-center overflow-hidden group",
                        !photo && "hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      {photo ? (
                        <>
                          <Image
                            src={photo.url || "/placeholder.svg"}
                            alt="Slot content"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemovePhoto(row, col)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          {photo.isPerson && (
                            <div className="absolute bottom-2 left-2 bg-primary/80 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                              Person
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground pointer-events-none">
                          Drop Here
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {globalConfig.footer?.enabled && (
              <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-between px-8 text-xs text-muted-foreground border-t border-transparent hover:border-border/50 transition-colors">
                <span>{globalConfig.footer.text}</span>
                {globalConfig.footer.showPageNumbers && (
                  <span>{activePageIndex + 1}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-72 border-l bg-background flex flex-col">
        <Tabs defaultValue="page" className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="page" className="flex-1">Page</TabsTrigger>
              <TabsTrigger value="global" className="flex-1">Global</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="page" className="flex-1 p-4 space-y-6 m-0">
             {/* Added ScrollArea for content that might exceed screen height */}
             <ScrollArea className="h-full">
              <div className="space-y-4 pb-20"> {/* Added pb-20 for bottom spacing */}
                <div className="space-y-2">
                  <Label>Page Name</Label>
                  <Input 
                    value={activePage.name} 
                    onChange={(e) => updateActivePage({ name: e.target.value })}
                  />
                </div>
                
                <div className="h-px bg-border my-4" />

                {activePage.type === 'frontPage' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        value={activePage.content?.title || ''} 
                        onChange={(e) => handleUpdateContent('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input 
                        value={activePage.content?.subtitle || ''} 
                        onChange={(e) => handleUpdateContent('subtitle', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input 
                        placeholder="Paste logo URL or drag photo"
                        value={activePage.content?.logo || ''} 
                        onChange={(e) => handleUpdateContent('logo', e.target.value)}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Drag a photo onto the canvas to set background
                    </div>
                  </div>
                ) : activePage.type === 'lastPage' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Text Elements</Label>
                      <Button size="sm" variant="outline" onClick={handleAddTextElement} className="gap-1 h-7 text-xs">
                        <Plus className="h-3 w-3" />
                        Add Text
                      </Button>
                    </div>
                    
                    {activePage.content?.elements?.map((element, idx) => (
                      <div key={element.id} className="p-3 border rounded-lg space-y-2 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">Text {idx + 1}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-5 w-5"
                            onClick={() => handleDeleteElement(element.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <textarea
                          className="w-full text-xs p-2 border rounded resize-none"
                          rows={3}
                          value={element.content}
                          onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Font Size</Label>
                            <Input 
                              type="number" 
                              className="h-7 text-xs"
                              value={element.fontSize}
                              onChange={(e) => handleUpdateElement(element.id, { fontSize: parseInt(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Weight</Label>
                            <select 
                              className="w-full h-7 text-xs border rounded px-2"
                              value={element.fontWeight}
                              onChange={(e) => handleUpdateElement(element.id, { fontWeight: e.target.value })}
                            >
                              <option value="normal">Normal</option>
                              <option value="bold">Bold</option>
                            </select>
                          </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Drag on canvas to position
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-xs text-muted-foreground pt-2">
                      Drag a photo onto the canvas to set background
                    </div>
                  </div>
                ) : activePage.type === 'welcome' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        value={activePage.content?.title || ''} 
                        onChange={(e) => handleUpdateContent('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input 
                        value={activePage.content?.subtitle || ''} 
                        onChange={(e) => handleUpdateContent('subtitle', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="overlay"
                        checked={activePage.content?.overlay}
                        onChange={(e) => handleUpdateContent('overlay', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="overlay">Dark Overlay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="centered"
                        checked={activePage.content?.centered}
                        onChange={(e) => handleUpdateContent('centered', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="centered">Centered Text</Label>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Rows ({activePage.config.rows})</Label>
                      <Slider
                        value={[activePage.config.rows]}
                        min={1}
                        max={6}
                        step={1}
                        onValueChange={([v]) => updateGridConfig({ rows: v })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Columns ({activePage.config.cols})</Label>
                      <Slider
                        value={[activePage.config.cols]}
                        min={1}
                        max={6}
                        step={1}
                        onValueChange={([v]) => updateGridConfig({ cols: v })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gap ({activePage.config.gap}px)</Label>
                      <Slider
                        value={[activePage.config.gap]}
                        min={0}
                        max={48}
                        step={4}
                        onValueChange={([v]) => updateGridConfig({ gap: v })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Padding ({activePage.config.padding}px)</Label>
                      <Slider
                        value={[activePage.config.padding]}
                        min={0}
                        max={96}
                        step={8}
                        onValueChange={([v]) => updateGridConfig({ padding: v })}
                      />
                    </div>
                  </>
                )}
              </div>
             </ScrollArea>
          </TabsContent>

          <TabsContent value="global" className="flex-1 p-4 space-y-6 m-0">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Header</h4>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="header-enabled"
                    checked={globalConfig.header?.enabled}
                    onChange={(e) => setGlobalConfig(prev => ({ ...prev, header: { ...prev.header!, enabled: e.target.checked } }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="header-enabled">Enable Header</Label>
                </div>
                {globalConfig.header?.enabled && (
                  <div className="space-y-2">
                    <Label>Header Text</Label>
                    <Input 
                      value={globalConfig.header.text} 
                      onChange={(e) => setGlobalConfig(prev => ({ ...prev, header: { ...prev.header!, text: e.target.value } }))}
                    />
                  </div>
                )}
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Footer</h4>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="footer-enabled"
                    checked={globalConfig.footer?.enabled}
                    onChange={(e) => setGlobalConfig(prev => ({ ...prev, footer: { ...prev.footer!, enabled: e.target.checked } }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="footer-enabled">Enable Footer</Label>
                </div>
                {globalConfig.footer?.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Footer Text</Label>
                      <Input 
                        value={globalConfig.footer.text} 
                        onChange={(e) => setGlobalConfig(prev => ({ ...prev, footer: { ...prev.footer!, text: e.target.value } }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="page-numbers"
                        checked={globalConfig.footer.showPageNumbers}
                        onChange={(e) => setGlobalConfig(prev => ({ ...prev, footer: { ...prev.footer!, showPageNumbers: e.target.checked } }))}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="page-numbers">Show Page Numbers</Label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
