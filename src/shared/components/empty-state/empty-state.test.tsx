import { fireEvent, render, screen } from "@testing-library/react";
import { Mail, Settings, User } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState Component", () => {
  const defaultProps = {
    title: "No se encontraron resultados",
    description: "Prueba ajustando los filtros de búsqueda.",
    icons: [User],
  };

  it("debería renderizar el título y la descripción", () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it("debería renderizar correctamente con un solo icono", () => {
    const { container } = render(<EmptyState {...defaultProps} />);

    // Verificamos que se renderice el contenedor del icono (grid size-12)
    const iconContainer = container.querySelector(".grid.size-12");
    expect(iconContainer).toBeInTheDocument();
  });

  it("debería renderizar correctamente con tres iconos", () => {
    const threeIconsProps = {
      ...defaultProps,
      icons: [User, Mail, Settings],
    };

    const { container } = render(<EmptyState {...threeIconsProps} />);

    // Debería haber 3 contenedores de iconos
    const iconContainers = container.querySelectorAll(".grid.size-12");
    expect(iconContainers).toHaveLength(3);
  });

  it("debería renderizar el botón de acción y manejar el click", () => {
    const handleClick = vi.fn();
    const actionProps = {
      ...defaultProps,
      action: {
        label: "Crear nuevo",
        onClick: handleClick,
      },
    };

    render(<EmptyState {...actionProps} />);

    const button = screen.getByRole("button", { name: /Crear nuevo/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("no debería renderizar el botón si no se proporciona la prop action", () => {
    render(<EmptyState {...defaultProps} action={undefined} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("debería aplicar clases CSS personalizadas", () => {
    const customClass = "my-custom-class";
    const { container } = render(
      <EmptyState {...defaultProps} className={customClass} />,
    );

    expect(container.firstChild).toHaveClass(customClass);
  });
});
