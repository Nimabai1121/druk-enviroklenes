import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productService from '@/services/products';
import { Product } from '@/types/database';

// Fallback data
const placeholderProducts: Product[] = [
  { id: '1', name: 'High-Carbon Ferromanganese', description: 'Essential alloy for steel production, providing strength and durability.', category: 'Ferromanganese', image_url: null, is_active: true, created_at: new Date().toISOString() },
  { id: '2', name: 'Ferrosilicon 75%', description: 'Deoxidizing agent critical for high-grade steel and cast iron manufacturing.', category: 'Ferrosilicon', image_url: null, is_active: true, created_at: new Date().toISOString() },
  { id: '3', name: 'Silicomanganese', description: 'Combined properties of silicon and manganese for superior steel refining.', category: 'Silicomanganese', image_url: null, is_active: true, created_at: new Date().toISOString() },
];

export function useProducts(activeOnly = false) {
  return useQuery({
    queryKey: ['products', activeOnly],
    queryFn: async () => {
      try {
        const data = activeOnly ? await productService.getActiveProducts() : await productService.getProducts();
        return data.length > 0 ? data : placeholderProducts.filter(p => activeOnly ? p.is_active : true);
      } catch (err) {
        return placeholderProducts.filter(p => activeOnly ? p.is_active : true);
      }
    }
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string, product: Partial<Product> }) => productService.updateProduct(id, product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });
}
