import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BreadcrumbSchema,
  LocalBusinessSchema,
  OrganizationSchema,
  ProductSchema,
} from "./structured-data";

describe("StructuredData Components", () => {
  describe("OrganizationSchema", () => {
    it("debería renderizar correctamente con el JSON-LD formateado", () => {
      const props = {
        name: "Lules Market",
        description: "El mejor mercado",
        url: "https://example.com",
        logo: "https://example.com/logo.png",
      };
      const { container } = render(<OrganizationSchema {...props} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(script).toBeInTheDocument();

      const content = JSON.parse(script?.innerHTML || "{}");
      expect(content["@type"]).toBe("Organization");
      expect(content.name).toBe(props.name);
      expect(content.description).toBe(props.description);
      expect(content.url).toBe(props.url);
      expect(content.logo).toBe(props.logo);
      expect(content.areaServed.name).toBe("Argentina");
    });
  });

  describe("ProductSchema", () => {
    it("debería renderizar correctamente con las props requeridas", () => {
      const props = {
        name: "Producto A",
        url: "https://example.com/producto-a",
      };
      const { container } = render(<ProductSchema {...props} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(script).toBeInTheDocument();

      const content = JSON.parse(script?.innerHTML || "{}");
      expect(content["@type"]).toBe("Product");
      expect(content.name).toBe(props.name);
      expect(content.url).toBe(props.url);
    });

    it("debería renderizar correctamente con precio y disponibilidad", () => {
      const props = {
        name: "Producto B",
        url: "https://example.com/producto-b",
        price: 100,
        currency: "USD",
        availability: "InStock" as const,
        seller: {
          name: "Vendedor Test",
          url: "https://example.com/vendedor",
        },
      };
      const { container } = render(<ProductSchema {...props} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );

      const content = JSON.parse(script?.innerHTML || "{}");
      expect(content.offers).toBeDefined();
      expect(content.offers.price).toBe("100");
      expect(content.offers.priceCurrency).toBe("USD");
      expect(content.offers.availability).toContain("InStock");
      expect(content.offers.seller.name).toBe("Vendedor Test");
    });
  });

  describe("LocalBusinessSchema", () => {
    it("debería renderizar correctamente con las props dadas", () => {
      const props = {
        name: "Tienda Local",
        description: "Una tienda local",
        address: "Calle 123",
        phone: "123456789",
        email: "contacto@tienda.com",
        url: "https://tienda.com",
      };
      const { container } = render(<LocalBusinessSchema {...props} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );

      const content = JSON.parse(script?.innerHTML || "{}");
      expect(content["@type"]).toBe("LocalBusiness");
      expect(content.name).toBe(props.name);
      expect(content.telephone).toBe(props.phone);
      expect(content.email).toBe(props.email);
      expect(content.address.streetAddress).toBe(props.address);
    });
  });

  describe("BreadcrumbSchema", () => {
    it("debería renderizar la lista de migas de pan correctamente", () => {
      const props = {
        items: [
          { name: "Inicio", url: "https://example.com" },
          { name: "Categoría", url: "https://example.com/categoria" },
        ],
      };
      const { container } = render(<BreadcrumbSchema {...props} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]',
      );

      const content = JSON.parse(script?.innerHTML || "{}");
      expect(content["@type"]).toBe("BreadcrumbList");
      expect(content.itemListElement).toHaveLength(2);
      expect(content.itemListElement[0].name).toBe("Inicio");
      expect(content.itemListElement[0].position).toBe(1);
      expect(content.itemListElement[1].name).toBe("Categoría");
      expect(content.itemListElement[1].position).toBe(2);
    });
  });
});
