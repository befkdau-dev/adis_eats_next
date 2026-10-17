import { promises as fs } from "node:fs";
import path from "node:path";

const ORDERS_FILE = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "orders.json",
);

async function readOrders() {
  try {
    const content = await fs.readFile(ORDERS_FILE, "utf8");
    const data = JSON.parse(content);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const orders = await readOrders();

    const order = orders.find((item) => String(item.id) === String(id));

    if (!order) {
      return Response.json(
        {
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Order not found.",
          },
        },
        { status: 404 },
      );
    }

    return Response.json({ order });
  } catch (error) {
    console.error("GET order failed:", error);

    return Response.json(
      {
        error: {
          code: "ORDER_FETCH_FAILED",
          message: "Unable to retrieve the order.",
        },
      },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const orders = await readOrders();

    const index = orders.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
      return Response.json(
        {
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Order not found.",
          },
        },
        { status: 404 },
      );
    }

    // Only allow updating the order status through this endpoint.
    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];

    if (
      typeof body.status !== "string" ||
      !allowedStatuses.includes(body.status)
    ) {
      return Response.json(
        {
          error: {
            code: "INVALID_STATUS",
            message: "A valid order status is required.",
          },
        },
        { status: 400 },
      );
    }

    orders[index] = {
      ...orders[index],
      status: body.status,
      updatedAt: new Date().toISOString(),
    };

    await writeOrders(orders);

    return Response.json({ order: orders[index] });
  } catch (error) {
    console.error("PUT order failed:", error);

    return Response.json(
      {
        error: {
          code: "ORDER_UPDATE_FAILED",
          message: "Unable to update the order.",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const orders = await readOrders();

    const orderExists = orders.some((item) => String(item.id) === String(id));

    if (!orderExists) {
      return Response.json(
        {
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Order not found.",
          },
        },
        { status: 404 },
      );
    }

    const remainingOrders = orders.filter(
      (item) => String(item.id) !== String(id),
    );

    await writeOrders(remainingOrders);

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE order failed:", error);

    return Response.json(
      {
        error: {
          code: "ORDER_DELETE_FAILED",
          message: "Unable to delete the order.",
        },
      },
      { status: 500 },
    );
  }
}
