import { AnimatePresence, motion } from "framer-motion";
import BadgeCard from "./GroundingFileCard";
import { GroundingFile } from "@/types";

type Props = {
    files: GroundingFile[];
    onClick: (e: React.MouseEvent, id: string, name?: string) => Promise<void>;
    isDownloading?: boolean;
    downloadingIcon?: boolean;
    icon?: boolean;
    label?: boolean;
};

export function GroundingFiles({ files, onClick, isDownloading, downloadingIcon, icon, label }: Props) {
    if (!files.length) return null;

    return (
        <div
            style={{
                padding: 15,
                border: 0
            }}
        >
            <AnimatePresence>
                <motion.div
                    layout
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 16,
                        marginTop: 16
                    }}
                >
                    {files.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: index * 0.08 }}
                        >
                            <BadgeCard
                                file={file}
                                onClick={e => onClick(e, file.id, file.name)}
                                isDownloading={isDownloading}
                                downloadingIcon={downloadingIcon}
                                icon={icon}
                                label={label}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
