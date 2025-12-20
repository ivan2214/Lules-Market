import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TagsField from "./tags-field";

// Mock de componentes UI si fuera necesario, pero usaremos los reales si es posible.
// Asumimos que Button y componentes UI funcionan correctamente o son simples wrappers.

describe("TagsField Component", () => {
  const defaultProps = {
    id: "tags-input",
    field: {
      value: [],
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: "tags",
      ref: vi.fn(),
    },
    label: "Etiquetas",
    placeholder: "Escribe y presiona Enter",
  };

  it("debería renderizar correctamente con etiqueta y placeholder", () => {
    render(<TagsField {...defaultProps} />);
    expect(screen.getByLabelText("Etiquetas")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Escribe y presiona Enter"),
    ).toBeInTheDocument();
  });

  it("debería añadir una etiqueta al presionar Enter", () => {
    const onChange = vi.fn();
    render(
      <TagsField
        {...defaultProps}
        field={{ ...defaultProps.field, value: [], onChange }}
      />,
    );

    const input = screen.getByPlaceholderText("Escribe y presiona Enter");
    fireEvent.change(input, { target: { value: "Nueva etiqueta" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Verifica que se llame a onChange con el nuevo array
    expect(onChange).toHaveBeenCalledWith(["Nueva etiqueta"]);
    // Verifica que el input se limpie (esto es manejo de estado interno, pero podemos comprobar el value)
    expect(input).toHaveValue("");
  });

  it("no debería añadir etiquetas duplicadas", () => {
    const onChange = vi.fn();
    const existingProps = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        value: ["existente"],
        onChange,
      },
    };
    render(<TagsField {...existingProps} />);

    const input = screen.getByPlaceholderText("Escribe y presiona Enter");
    fireEvent.change(input, { target: { value: "existente" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("no debería añadir etiquetas vacías", () => {
    const onChange = vi.fn();
    render(
      <TagsField
        {...defaultProps}
        field={{ ...defaultProps.field, onChange }}
      />,
    );

    const input = screen.getByPlaceholderText("Escribe y presiona Enter");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("debería eliminar todas las etiquetas al hacer click en el botón de limpiar", () => {
    const onChange = vi.fn();
    const propsWithTags = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        value: ["tag1", "tag2"],
        onChange,
      },
    };

    render(<TagsField {...propsWithTags} />);

    // El botón de limpiar es el primer botón en el DOM porque está en el InputGroupAddon (antes que la lista de tags)
    // o podemos buscarlo por su contenedor si fuera necesario.
    // Asumiremos que es el primer botón encontrado que no tiene texto de tag.
    const buttons = screen.getAllByRole("button");
    const clearButton = buttons[0]; // El primer botón debería ser el de limpiar (XCircle)

    fireEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("debería eliminar una etiqueta específica", () => {
    const onChange = vi.fn();
    const propsWithTags = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        value: ["tag1", "tag2"],
        onChange,
      },
    };
    render(<TagsField {...propsWithTags} />);

    // Buscamos el botón que contiene el texto del tag
    const tag1Button = screen.getByRole("button", { name: /tag1/i });
    fireEvent.click(tag1Button);

    // Debería filtrar "tag1" y dejar solo "tag2"
    expect(onChange).toHaveBeenCalledWith(["tag2"]);
  });

  it("debería mostrar estado de error", () => {
    const errorProp = {
      ...defaultProps,
      error: { type: "required", message: "Este campo es requerido" },
    };

    render(<TagsField {...errorProp} />);
    // El componente FieldError debería mostrar el mensaje
    expect(screen.getByText("Este campo es requerido")).toBeInTheDocument();
  });
});
