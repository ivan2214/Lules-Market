"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";

export const SearchForm = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/explorar?search=${encodeURIComponent(search)}`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto lg:max-w-md lg:flex-1">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar productos o comercios..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  );
};
