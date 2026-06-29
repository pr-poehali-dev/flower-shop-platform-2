import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { compressImageTo10kb } from "@/lib/compressImage";
import func2url from "../../backend/func2url.json";

const API = func2url.products;

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

const CATEGORIES = [
  { id: "flowers", label: "Цветы" },
  { id: "terrariums", label: "Флорариумы" },
];

export default function Admin() {
  const [token, setToken] = useState(
    localStorage.getItem("flora_admin_token") || "",
  );
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("flowers");
  const [image, setImage] = useState("");
  const [imgInfo, setImgInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadItems = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data.items || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const tryLogin = async () => {
    setError("");
    const res = await fetch(API, {
      method: "DELETE",
      headers: { "X-Admin-Token": token },
    });
    if (res.status === 403) {
      setError("Неверный пароль");
      return;
    }
    localStorage.setItem("flora_admin_token", token);
    setAuthed(true);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setImgInfo("Сжимаем фото...");
    try {
      const compressed = await compressImageTo10kb(file);
      const kb = ((compressed.length * 3) / 4 / 1024).toFixed(1);
      setImage(compressed);
      setImgInfo(`Готово · ~${kb} КБ`);
    } catch {
      setImgInfo("Не удалось обработать фото");
    } finally {
      setBusy(false);
    }
  };

  const addProduct = async () => {
    if (!name.trim()) {
      setError("Введите название");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify({ name, price, description, category, image }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Ошибка при добавлении");
      return;
    }
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
    setImgInfo("");
    loadItems();
  };

  const remove = async (id: number) => {
    await fetch(`${API}?id=${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": token },
    });
    loadItems();
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <a href="/" className="font-display text-4xl block text-center mb-2">
            Мамина Бегония
          </a>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Вход в админ-панель
          </p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            placeholder="Пароль"
            className="w-full bg-secondary px-4 py-3 outline-none focus:ring-1 ring-accent mb-4"
          />
          {error && <p className="text-destructive text-sm mb-4">{error}</p>}
          <button
            onClick={tryLogin}
            className="w-full bg-primary text-primary-foreground py-3 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
          >
            Войти
          </button>
          <a
            href="/"
            className="block text-center text-xs text-muted-foreground mt-6 hover:text-foreground"
          >
            ← На сайт
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-display text-4xl">Админ-панель</h1>
        <a
          href="/"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <Icon name="ArrowLeft" size={16} /> На сайт
        </a>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-card border border-border p-8">
          <h2 className="font-display text-2xl mb-6">Новый товар</h2>
          <div className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название"
              className="w-full bg-secondary px-4 py-3 outline-none focus:ring-1 ring-accent"
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Цена, например 8 900 ₽"
              className="w-full bg-secondary px-4 py-3 outline-none focus:ring-1 ring-accent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              rows={2}
              className="w-full bg-secondary px-4 py-3 outline-none focus:ring-1 ring-accent resize-none"
            />
            <div className="flex gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex-1 py-2.5 text-xs uppercase tracking-[0.15em] border transition-colors ${category === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-foreground"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="block cursor-pointer">
              <div className="border border-dashed border-border hover:border-accent transition-colors p-6 text-center text-sm text-muted-foreground">
                {image ? (
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={image}
                      alt="Превью"
                      className="w-16 h-16 object-cover"
                    />
                    <span>{imgInfo}</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="ImagePlus" size={18} />{" "}
                    {busy ? imgInfo : "Загрузить фото (сожмём до 10 КБ)"}
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="hidden"
              />
            </label>

            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              onClick={addProduct}
              disabled={loading || busy}
              className="w-full bg-primary text-primary-foreground py-3.5 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Добавляем..." : "Добавить товар"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl mb-6">
            Каталог · {items.length}
          </h2>
          <div className="space-y-3">
            {items.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-card border border-border p-3"
              >
                <div className="w-16 h-16 bg-secondary shrink-0 overflow-hidden">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {p.name || "Без названия"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {CATEGORIES.find((c) => c.id === p.category)?.label} ·{" "}
                    {p.price}
                  </div>
                </div>
                <button
                  onClick={() => remove(p.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-2"
                >
                  <Icon name="Trash2" size={18} />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-muted-foreground text-sm">Пока нет товаров</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
