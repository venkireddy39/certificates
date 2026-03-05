import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Draggable from "./Draggable";
import Ruler from "./Ruler";
import { QRCodeCanvas } from "qrcode.react";

const PAGE_SIZE = {
  A4: {
    landscape: { w: 1000, h: 707 },
    portrait: { w: 707, h: 1000 }
  }
};

const CertificateRenderer = ({
  template,
  data,
  isDesigning = false,
  scale: fixedScale,
  onUpdateTemplate,
  onSelectElement,
  selectedId
}) => {
  if (!template) return null;

  // Support both flat template objects AND objects where design is a sub-property
  const designData = template.design || template || {};
  const { page = {}, theme = {}, elements = [] } = designData;

  const cleanVal = (val) => (typeof val === 'string' && val !== "null" && val.trim() !== "") ? val : undefined;

  // Mix in top-level template properties into the theme for convenience
  const effectiveTheme = {
    ...theme,
    backgroundImage: cleanVal(template.backgroundUrl) || cleanVal(template.backgroundImageUrl) || cleanVal(theme.backgroundImage),
    logoUrl: cleanVal(template.logoUrl) || cleanVal(theme.logoUrl),
    signatureUrl: cleanVal(template.signatureUrl) || cleanVal(theme.signatureUrl)
  };

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Use page dimensions from design if available, otherwise from PAGE_SIZE
  const pageDef =
    (page.width && page.height) ? { w: page.width, h: page.height } :
      PAGE_SIZE[page?.type]?.[page?.orientation] ||
      PAGE_SIZE.A4.landscape;

  const { w = 1000, h = 707 } = pageDef;


  // ---- SCALE HANDLING ----
  useEffect(() => {
    if (fixedScale) {
      setScale(fixedScale);
      return;
    }

    const resize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width > 0 && w > 0) {
        setScale(width / w);
      }
    };

    resize();

    if (!containerRef.current) return;
    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [fixedScale, w]);

  // ---- ELEMENT UPDATE ----
  const updateElement = useCallback(
    (id, patch) => {
      if (!onUpdateTemplate) return;

      onUpdateTemplate(prev => ({
        ...prev,
        elements: prev.elements.map(el =>
          el.id === id ? { ...el, ...patch } : el
        )
      }));
    },
    [onUpdateTemplate]
  );

  // ---- CUSTOM HTML MODE ----
  if (template.customHtml) {
    const finalSrcDoc = useMemo(() => {
      let code = template.customHtml;

      const replacements = {
        "{{studentName}}": data.recipientName ?? "Student Name",
        "{{courseName}}": data.courseName ?? "Course Name",
        "{{issueDate}}": data.date
          ? new Date(data.date).toLocaleDateString()
          : new Date().toLocaleDateString(),
        "{{instituteName}}": data.instituteName ?? "LMS Institute",
        "{{certificateId}}": data.certificateId ?? "CERT-SAMPLE"
      };

      Object.entries(replacements).forEach(([k, v]) => {
        code = code.split(k).join(v);
      });

      return code;
    }, [template.customHtml, data]);

    return (
      <div
        ref={containerRef}
        style={{ width: "100%", paddingTop: "70%", position: "relative" }}
      >
        <iframe
          srcDoc={finalSrcDoc}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none"
          }}
          title="Certificate"
        />
      </div>
    );
  }

  // ---- JSON ELEMENT MODE ----
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: h * scale,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          backgroundColor: effectiveTheme.backgroundImage ? "transparent" : "#fff",
          backgroundImage: effectiveTheme.backgroundImage
            ? `url("${effectiveTheme.backgroundImage}")`
            : "none",
          backgroundSize: "cover",
          fontFamily: effectiveTheme.fontFamily,
          color: effectiveTheme.textColor,
          boxShadow: "0 4px 6px rgba(0,0,0,.1)"
        }}
      >
        {/* WATERMARK LAYER */}
        {effectiveTheme.watermark && effectiveTheme.watermark.type !== "none" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {/* TEXT WATERMARK */}
            {effectiveTheme.watermark.type === "text" && (
              effectiveTheme.watermark.isRepeated ? (
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="wm-pattern" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
                      <text
                        x="150"
                        y="150"
                        fill={effectiveTheme.watermark.color || "rgba(0,0,0,0.1)"}
                        fontSize="24"
                        transform="rotate(-45, 150, 150)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontWeight: "bold" }}
                      >
                        {effectiveTheme.watermark.text || "WATERMARK"}
                      </text>
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#wm-pattern)" />
                </svg>
              ) : (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%",
                  transform: "rotate(-45deg)",
                  color: effectiveTheme.watermark.color || "rgba(0,0,0,0.1)",
                  fontSize: "80px", fontWeight: "bold"
                }}>
                  {effectiveTheme.watermark.text || "WATERMARK"}
                </div>
              )
            )}

            {/* IMAGE WATERMARK */}
            {effectiveTheme.watermark.type === "image" && effectiveTheme.watermark.src && (
              <div style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url("${effectiveTheme.watermark.src}")`,
                backgroundRepeat: effectiveTheme.watermark.isRepeated ? "repeat" : "no-repeat",
                backgroundPosition: "center",
                backgroundSize: effectiveTheme.watermark.isRepeated ? "200px" : "50%",
                opacity: effectiveTheme.watermark.opacity ?? 0.1
              }} />
            )}
          </div>
        )}

        {/* BORDER LAYER */}
        {effectiveTheme.border && effectiveTheme.border.type !== "none" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              borderStyle:
                effectiveTheme.border.type === "modern" ? "double" :
                  effectiveTheme.border.type === "premium" ? "ridge" :
                    effectiveTheme.border.type === "dashed" ? "dashed" :
                      effectiveTheme.border.type === "dotted" ? "dotted" : "solid",
              borderWidth: `${effectiveTheme.border.width || 5}px`,
              borderColor: effectiveTheme.border.color || "#000",
              borderRadius: `${effectiveTheme.border.radius || 0}px`,
              boxSizing: "border-box"
            }}
          />
        )}

        {/* FIXED LOGO LAYER */}
        {effectiveTheme.logoUrl && (
          <img
            src={effectiveTheme.logoUrl}
            alt="Logo"
            style={{
              position: "absolute",
              top: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              maxHeight: "100px",
              maxWidth: "250px",
              objectFit: "contain",
              zIndex: 2,
              pointerEvents: "none"
            }}
          />
        )}

        {/* FIXED SIGNATURE LAYER */}
        {effectiveTheme.signatureUrl && (
          <img
            src={effectiveTheme.signatureUrl}
            alt="Signature"
            style={{
              position: "absolute",
              bottom: "60px",
              right: "80px",
              maxHeight: "80px",
              maxWidth: "250px",
              objectFit: "contain",
              zIndex: 2,
              pointerEvents: "none"
            }}
          />
        )}

        {/* GRID OVERLAY */}
        {effectiveTheme.showGrid && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 999,
              pointerEvents: "none",
              backgroundImage: `
                 linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
               `,
              backgroundSize: "50px 50px"
            }}
          />
        )}

        {/* RULERS */}
        {effectiveTheme.showGrid && (
          <>
            <Ruler length={w} orientation="horizontal" />
            <Ruler length={h} orientation="vertical" />
          </>
        )}

        {elements.map(el => (
          <Draggable
            key={el.id}
            initialPos={{ x: el.x, y: el.y }}
            initialSize={{ w: el.w, h: el.h }}
            isEnabled={isDesigning}
            resizable={isDesigning}
            scale={scale}
            gridSize={effectiveTheme.showGrid ? 50 : 0} // Enable snapping
            isSelected={selectedId === el.id}
            onSelect={() => onSelectElement?.(el.id)}
            onDragEnd={pos => updateElement(el.id, pos)}
            onResizeEnd={size => updateElement(el.id, size)}
          >
            {el.type === "text" && (
              <div style={el.style}>
                {String(el.content || "").replace(
                  /{{(.*?)}}/g,
                  (_, k) => {
                    const mappedKey = k === "studentName" ? "recipientName"
                      : k === "issueDate" ? "date"
                        : k;
                    return data[mappedKey] ?? `{{${k}}}`;
                  }
                )}
              </div>
            )}

            {el.type === "image" && (
              <img
                src={el.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: el.style?.opacity ?? 1
                }}
              />
            )}

            {el.type === "qr" && (
              <div style={{ width: "100%", height: "100%" }}>
                <QRCodeCanvas
                  value={`https://lms.com/verify/${data.certificateId || 'CERT-SAMPLE'}`}
                  size={Math.min(el.w, el.h)}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default CertificateRenderer;
