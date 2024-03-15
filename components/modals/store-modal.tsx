import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"

export function StoreModal() {
  const storeModal = useStoreModal()

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage your business and earnings"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Modal
    </Modal>
  )
}
