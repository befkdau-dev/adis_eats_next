import { getDish } from "@/app/lib/dishes";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  const name = dish ? dish.name : "Dish not found";
  const price = dish ? `${dish.price} ETB` : "";
  const description = dish?.description ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        color: "white",
        background: "#0A1F3D",
      }}
    >
      <div style={{ fontSize: 28, color: "#ea580c", fontWeight: 600 }}>
        Adis Eats
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#ea580c" }}>
          {name}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 29,
            marginTop: 16,
            maxWidth: 900,
          }}
        >
          {description}
        </div>
        {price && (
          <div
            style={{
              color: "#ea580c",
              marginTop: 10,
              fontWeight: 700,
              fontSize: 40,
            }}
          >
            {price}
          </div>
        )}
      </div>
    </div>,
    { ...size },
  );
}
