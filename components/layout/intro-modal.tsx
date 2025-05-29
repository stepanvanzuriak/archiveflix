"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { useUserStore } from "@/stores/user-store-provider";

export default function IntroModal() {
  const isIntoShown = useUserStore((store) => store.introModalShown);
  const closeIntroModal = useUserStore((store) => store.closeIntroModal);

  return (
    <Modal
      backdrop="blur"
      isOpen={!isIntoShown}
      onOpenChange={() => closeIntroModal()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Wellcome to ArchiveFlix
            </ModalHeader>
            <ModalBody>
              <p>
                This platform is powered entirely by content from{" "}
                <Link href="https://archive.org/" isExternal showAnchorIcon>
                  archive.org
                </Link>
                . Please note:
              </p>
              <ul className="list-disc pl-4">
                <li>
                  Some material may be <b>disturbing or sensitive</b>, as it
                  reflects a wide range of historical and cultural archives.
                </li>
                <li>
                  You can mark any content you don’t want to see with the{" "}
                  <b>“Not Interested”</b> option to help filter your experience.
                </li>
                <li>
                  Content rating filters (such as R ratings){" "}
                  <b>may be added in the future</b>, but their availability is
                  not guaranteed.
                </li>
              </ul>
              <p>
                Enjoy exploring the archive — responsibly and on your own terms.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Continue
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
