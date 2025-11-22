import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const body = await request.json()
    const { selectedItems, customerName } = body

    // In a real app, this would:
    // 1. Save the customer selection to database
    // 2. Update event progress to step 3
    // 3. Create a notification for the photographer
    // 4. Trigger S3 upload process (step 4)

    console.log("Customer selection submitted:", {
      eventId,
      customerName,
      selectedItems
    })

    const submittedAt = new Date().toISOString()
    const finalCustomerName = customerName || "Customer"

    // Mock response - in real app, save to database
    // Example database operations:
    // await db.events.update({
    //   where: { id: eventId },
    //   data: { progressStep: 3, customerSubmittedAt: submittedAt }
    // })
    // await db.notifications.create({
    //   data: {
    //     eventId,
    //     message: "has submitted the photo selection",
    //     type: "submission",
    //     customerName: finalCustomerName,
    //     read: false
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: "Selection submitted successfully",
      data: {
        eventId,
        progressStep: 3, // Customer submitted
        submittedAt,
        customerName: finalCustomerName,
        selectedItems,
        notification: {
          id: `notif_${Date.now()}`,
          eventId,
          message: "has submitted the photo selection",
          type: "submission",
          customerName: finalCustomerName,
          timestamp: submittedAt,
          read: false
        }
      }
    })
  } catch (error: any) {
    console.error("Failed to submit selection:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit selection" },
      { status: 500 }
    )
  }
}


