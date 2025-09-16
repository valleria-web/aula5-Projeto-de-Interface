"use client"

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

// --- Utilities ---------------------------------------------------------------
// Compute total in a pure function so we can add quick tests below
function computeTotal(items: Array<{ preco: number; qtd: number }>): number {
  return items.reduce((acc, it) => acc + (Number(it.preco) || 0) * (Number(it.qtd) || 0), 0);
}

// Quick dev tests (run in browser only); these DO NOT affect UI behavior
if (typeof window !== "undefined") {
  try {
    console.assert(computeTotal([{ preco: 10, qtd: 2 }]) === 20, "TC1: 10*2 should be 20");
    console.assert(computeTotal([{ preco: 0, qtd: 5 }, { preco: 2.5, qtd: 4 }]) === 10, "TC2: 0*5 + 2.5*4 should be 10");
    console.assert(computeTotal([]) === 0, "TC3: empty list should be 0");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("computeTotal tests encountered an error", e);
  }
}

export default function RegistrarVendasUI() {
  const [cliente, setCliente] = useState<string>("");
  const [itens, setItens] = useState<Array<{ id: number; produto: string; preco: number; qtd: number }>>([
    { id: 1, produto: "Notebook Gamer", preco: 2499.0, qtd: 1 },
    { id: 2, produto: "Mouse Wireless", preco: 99.0, qtd: 2 },
  ]);

  const total = useMemo(() => computeTotal(itens), [itens]);

  const remover = (id: number) => setItens((arr) => arr.filter((i) => i.id !== id));
  const addItem = () => {
    const nextId = Math.max(0, ...itens.map((i) => i.id)) + 1;
    setItens((arr) => [...arr, { id: nextId, produto: "", preco: 0, qtd: 1 }]);
  };

  const updateQtd = (id: number, qtd: number) =>
    setItens((arr) => arr.map((i) => (i.id === id ? { ...i, qtd: Math.max(1, Number.isFinite(qtd) ? qtd : 1) } : i)));
  const updateProduto = (id: number, produto: string) => setItens((arr) => arr.map((i) => (i.id === id ? { ...i, produto } : i)));
  const updatePreco = (id: number, preco: number) =>
    setItens((arr) => arr.map((i) => (i.id === id ? { ...i, preco: Math.max(0, Number.isFinite(preco) ? preco : 0) } : i)));

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" className="px-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span>Dashboard</span>
        <span>/</span>
        <span>Vendas</span>
        <span>/</span>
        <span className="font-medium text-foreground">Registrar</span>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="cliente">Buscar por nome/CPF/email</Label>
            <Input
              id="cliente"
              placeholder="Ex.: Maria Silva / 123.456.789-00 / maria@email.com"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white hover:bg-green-700">Novo Cliente</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>Cadastre rapidamente um novo cliente.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div>
                    <Label>Nome*</Label>
                    <Input placeholder="Nome completo" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Documento*</Label>
                      <Input placeholder="CPF" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input placeholder="email@dominio.com" />
                    </div>
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Itens da Venda</CardTitle>
            <Button onClick={addItem} className="bg-green-600 text-white hover:bg-green-700" size="sm">
              <Plus className="h-4 w-4" /> Adicionar item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[140px]">Preço (R$)</TableHead>
                <TableHead className="w-[100px]">Qtde</TableHead>
                <TableHead className="w-[160px]">Subtotal (R$)</TableHead>
                <TableHead className="w-[90px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((it) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <Input
                      value={it.produto}
                      onChange={(e) => updateProduto(it.id, e.target.value)}
                      placeholder="Digite para buscar produto"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={it.preco}
                      onChange={(e) => updatePreco(it.id, parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={it.qtd} onChange={(e) => updateQtd(it.id, parseInt(e.target.value))} />
                  </TableCell>
                  <TableCell>
                    {(it.preco * it.qtd).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => remover(it.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Itens: {itens.reduce((a, i) => a + i.qtd, 0)}</Badge>
            <Badge variant="secondary">Descontos: R$ 0,00</Badge>
            <Badge className="text-base bg-blue-600 text-white hover:bg-blue-700">Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Badge>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="w-full md:w-auto bg-green-600 text-white hover:bg-green-700">Salvar Venda</Button>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                setCliente("");
                setItens([]);
              }}
            >
              Limpar
            </Button>
            <Button variant="ghost" className="w-full md:w-auto">
              Cancelar
            </Button>
          </div>
        </CardFooter>
      </Card>

      <p className="text-xs text-muted-foreground">Toasts/Mensagens: sucesso/erro; validações inline nos campos.</p>
    </div>
  );
}
