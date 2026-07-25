import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/material/styles";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import type { CategorySlug } from "../types";
import { categoryOrder, categoryMeta } from "../data/categories";
import { activeBusinesses } from "../data/mockData";
import SearchBar from "../components/common/SearchBar";
import CategoryFilter from "../components/common/CategoryFilter";
import BusinessCard from "../components/business/BusinessCard";

type SortKey = "recomandate" | "rating" | "nume";

function isCategorySlug(value: string): value is CategorySlug {
  return (categoryOrder as string[]).includes(value);
}

export default function DirectoryPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [selected, setSelected] = useState<CategorySlug[]>(() => {
    const cat = params.get("cat");
    return cat && isCategorySlug(cat) ? [cat] : [];
  });
  const [sort, setSort] = useState<SortKey>("recomandate");

  const toggle = (slug: CategorySlug) =>
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const results = useMemo(() => {
    let list = activeBusinesses;
    if (selected.length) {
      list = list.filter((b) =>
        b.categorySlugs.some((c) => selected.includes(c)),
      );
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.location.city.toLowerCase().includes(q) ||
          b.shortDescription.toLowerCase().includes(q) ||
          b.categorySlugs.some((c) =>
            categoryMeta[c].label.toLowerCase().includes(q),
          ),
      );
    }
    const sorted = [...list];
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "nume")
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ro"));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [query, selected, sort]);

  const reset = () => {
    setQuery("");
    setSelected([]);
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: alpha("#8C2F39", 0.04),
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container sx={{ py: { xs: 4, md: 5 } }}>
          <Typography variant="overline" sx={{ color: "secondary.dark" }}>
            Director afaceri
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: "1.9rem", md: "2.4rem" }, mb: 2.5 }}
          >
            Găsește exact ce cauți
          </Typography>
          <Box sx={{ maxWidth: 620 }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Caută după nume, localitate sau produs…"
            />
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 4, md: 5 } }}>
        <Box sx={{ mb: 3 }}>
          <CategoryFilter
            selected={selected}
            onToggle={toggle}
            onClear={() => setSelected([])}
            showCounts
          />
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            {results.length} {results.length === 1 ? "rezultat" : "rezultate"}
          </Typography>
          <TextField
            select
            size="small"
            label="Sortează"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="recomandate">Recomandate</MenuItem>
            <MenuItem value="rating">Cele mai bine cotate</MenuItem>
            <MenuItem value="nume">Alfabetic (A–Z)</MenuItem>
          </TextField>
        </Stack>

        {results.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {results.map((b) => (
              <BusinessCard key={b.businessId} business={b} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 4,
            }}
          >
            <SearchOffRoundedIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 1.5 }}
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Niciun rezultat
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2.5 }}
            >
              Încearcă alți termeni sau elimină filtrele active.
            </Typography>
            <Button variant="outlined" onClick={reset}>
              Resetează căutarea
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
