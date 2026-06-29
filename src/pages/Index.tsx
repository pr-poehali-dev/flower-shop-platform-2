import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const API = func2url.products;

const HERO_IMG =
  "https://cdn.poehali.dev/projects/0658668e-0861-46c8-ab6d-6f150baa7aa4/files/4ae8b193-ebb2-4a95-9f22-c6a917331b03.jpg";
const TERRARIUM_IMG =
  "https://cdn.poehali.dev/projects/0658668e-0861-46c8-ab6d-6f150baa7aa4/files/0f79ee21-d6f4-4d70-b27a-eb9f92cc46b5.jpg";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

const TABS = [
  { id: "flowers", label: "Цветы" },
  { id: "terrariums", label: "Флорариумы" },
  { id: "about", label: "О нас" },
  { id: "blog", label: "Блог" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const posts = [
  {
    date: "14 июня",
    title: "Как продлить жизнь букета на 2 недели",
    read: "4 мин",
  },
  { date: "02 июня", title: "Флорариум: уход без хлопот", read: "6 мин" },
  {
    date: "28 мая",
    title: "Язык цветов: что подарить и не ошибиться",
    read: "5 мин",
  },
];

function ProductGrid({
  items,
  fallbackImg,
}: {
  items: Product[];
  fallbackImg: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        Скоро здесь появятся новинки.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="group animate-fade-in opacity-0"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="overflow-hidden bg-secondary aspect-[4/5] mb-5">
            <img
              src={item.image || fallbackImg}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
            <span className="text-sm tracking-wide text-muted-foreground whitespace-nowrap">
              {item.price}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {item.description}
          </p>
          <button className="mt-4 text-xs tracking-[0.2em] uppercase border-b border-foreground/30 pb-1 hover:border-foreground transition-colors">
            В корзину
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const [tab, setTab] = useState<TabId>("flowers");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => setProducts(d.items || []))
      .catch(() => setProducts([]));
  }, []);

  const flowers = products.filter((p) => p.category === "flowers");
  const terrariums = products.filter((p) => p.category === "terrariums");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="font-display text-3xl tracking-wide">
            Flora
          </a>
          <nav className="hidden md:flex items-center gap-10">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-xs uppercase tracking-[0.18em] transition-colors ${
                  tab === t.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <button className="flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
            <Icon name="ShoppingBag" size={18} />
            <span className="hidden sm:inline">Корзина</span>
          </button>
        </div>
      </header>

      <section className="relative pt-20">
        <div className="grid lg:grid-cols-2 min-h-[88vh]">
          <div className="flex flex-col justify-center px-8 lg:px-20 py-20 order-2 lg:order-1">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6 animate-fade-in opacity-0">
              Премиальная флористика
            </p>
            <h1
              className="font-display text-5xl lg:text-7xl leading-[1.05] mb-8 text-balance animate-fade-in opacity-0"
              style={{ animationDelay: "120ms" }}
            >
              Цветы, которые
              <br />
              говорят за вас
            </h1>
            <p
              className="text-muted-foreground max-w-md leading-relaxed mb-10 animate-fade-in opacity-0"
              style={{ animationDelay: "240ms" }}
            >
              Авторские букеты и флорариумы ручной работы из редких сортов.
              Доставка по городу в день заказа.
            </p>
            <div
              className="flex gap-4 animate-fade-in opacity-0"
              style={{ animationDelay: "360ms" }}
            >
              <button
                onClick={() => setTab("flowers")}
                className="bg-primary text-primary-foreground px-9 py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => setTab("about")}
                className="px-9 py-4 text-xs uppercase tracking-[0.2em] border border-foreground/20 hover:border-foreground transition-colors"
              >
                О нас
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 overflow-hidden animate-scale-in opacity-0">
            <img
              src={HERO_IMG}
              alt="Букет премиум"
              className="w-full h-full object-cover min-h-[40vh]"
            />
          </div>
        </div>
      </section>

      <section className="container py-24 lg:py-32">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-display text-2xl lg:text-3xl px-2 transition-colors ${
                tab === t.id
                  ? "text-foreground border-b-2 border-accent pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "flowers" && (
          <div>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Каждый букет собирается вручную в день доставки из свежесрезанных
              цветов.
            </p>
            <ProductGrid items={flowers} fallbackImg={HERO_IMG} />
          </div>
        )}

        {tab === "terrariums" && (
          <div>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Живые композиции в стекле, которые украсят интерьер и не требуют
              сложного ухода.
            </p>
            <ProductGrid items={terrariums} fallbackImg={TERRARIUM_IMG} />
          </div>
        )}

        {tab === "about" && (
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <img
              src={TERRARIUM_IMG}
              alt="Мастерская Flora"
              className="w-full aspect-square object-cover"
            />
            <div>
              <h2 className="font-display text-4xl mb-6">Студия Flora</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Мы — небольшая команда флористов, влюблённых в своё дело. С 2016
                года создаём букеты и флорариумы, которые становятся частью
                важных моментов.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Работаем только с проверенными плантациями Эквадора, Голландии и
                Кении, отбирая каждый стебель вручную.
              </p>
              <div className="flex gap-12">
                <div>
                  <div className="font-display text-4xl">8+</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    лет на рынке
                  </div>
                </div>
                <div>
                  <div className="font-display text-4xl">12K</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    букетов создано
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "blog" && (
          <div className="max-w-3xl mx-auto divide-y divide-border">
            {posts.map((post, i) => (
              <article
                key={post.title}
                className="py-8 flex items-baseline justify-between gap-8 group cursor-pointer animate-fade-in opacity-0"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-accent mb-2">
                    {post.date} · {post.read}
                  </div>
                  <h3 className="font-display text-2xl lg:text-3xl group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                </div>
                <Icon
                  name="ArrowUpRight"
                  size={24}
                  className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
                />
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-auto bg-primary text-primary-foreground">
        <div className="container py-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="font-display text-3xl mb-4">Flora</div>{" "}
              <p className="text-sm text-primary-foreground/60 max-w-xs leading-relaxed">
                Премиальные флорариумы ручной работы.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/50 mb-4">
                Контакты
              </div>
              <p className="text-sm leading-relaxed">
                +7 (900) 123-45-67
                <br />
                hello@flora.studio
                <br />
                Москва, ул. Цветочная, 1
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/50 mb-4">
                Мы в сети
              </div>
              <div className="flex gap-4">
                <Icon
                  name="Instagram"
                  size={22}
                  className="hover:text-accent transition-colors cursor-pointer"
                />
                <Icon
                  name="Send"
                  size={22}
                  className="hover:text-accent transition-colors cursor-pointer"
                />
                <Icon
                  name="Phone"
                  size={22}
                  className="hover:text-accent transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-primary-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-foreground/40">
              © 2026 Flora Studio. Все права защищены.
            </p>
            <a
              href="/admin"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary-foreground/40 hover:text-primary-foreground transition-colors"
            >
              <Icon name="Lock" size={14} />
              Админ-панель
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}