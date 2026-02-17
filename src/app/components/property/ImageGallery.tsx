/**
 * Image Gallery Component
 * ========================
 * Responsive image gallery with fullscreen mode
 */

'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand, Grid3X3 } from 'lucide-react';
import Image from 'next/image';
import styles from './imageGallery.module.css';

interface GalleryImage {
    url: string;
    alt: string;
    isPrimary?: boolean;
}

interface ImageGalleryProps {
    images: GalleryImage[];
    title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showGrid, setShowGrid] = useState(false);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') setShowFullscreen(false);
    };

    return (
        <>
            {/* Main Gallery */}
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <Image
                        src={images[currentIndex].url}
                        alt={images[currentIndex].alt || title}
                        fill
                        priority
                        sizes="(max-width: 1200px) 100vw, 80vw"
                    />

                    <button
                        className={`${styles.navBtn} ${styles.prevBtn}`}
                        onClick={goToPrevious}
                        aria-label="Previous image"
                        title="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        className={`${styles.navBtn} ${styles.nextBtn}`}
                        onClick={goToNext}
                        aria-label="Next image"
                        title="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className={styles.controls}>
                        <button
                            className={styles.controlBtn}
                            onClick={() => setShowGrid(true)}
                            aria-label="View all images"
                            title="View all images"
                        >
                            <Grid3X3 size={18} />
                            <span>View All ({images.length})</span>
                        </button>
                        <button
                            className={styles.controlBtn}
                            onClick={() => setShowFullscreen(true)}
                            aria-label="Open fullscreen"
                            title="Open fullscreen"
                        >
                            <Expand size={18} />
                            <span>Fullscreen</span>
                        </button>
                    </div>

                    <div className={styles.counter}>
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                <div className={styles.thumbnails}>
                    {images.slice(0, 5).map((image, idx) => (
                        <button
                            key={idx}
                            className={`${styles.thumbnail} ${idx === currentIndex ? styles.active : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`View image ${idx + 1}`}
                            title={`View image ${idx + 1}`}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || `${title} - ${idx + 1}`}
                                fill
                                sizes="100px"
                            />
                            {idx === 4 && images.length > 5 && (
                                <div className={styles.moreOverlay}>
                                    +{images.length - 5}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {showFullscreen && (
                <div
                    className={styles.fullscreenModal}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <button
                        className={styles.closeBtn}
                        onClick={() => setShowFullscreen(false)}
                        aria-label="Close fullscreen"
                        title="Close fullscreen"
                    >
                        <X size={24} />
                    </button>

                    <div className={styles.fullscreenContent}>
                        <button
                            className={`${styles.navBtn} ${styles.prevBtn}`}
                            onClick={goToPrevious}
                            aria-label="Previous image"
                            title="Previous image"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <Image
                            src={images[currentIndex].url}
                            alt={images[currentIndex].alt || title}
                            width={1200}
                            height={800}
                            className={styles.fullscreenImage}
                        />

                        <button
                            className={`${styles.navBtn} ${styles.nextBtn}`}
                            onClick={goToNext}
                            aria-label="Next image"
                            title="Next image"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    <div className={styles.fullscreenThumbnails}>
                        {images.map((image, idx) => (
                            <button
                                key={idx}
                                className={`${styles.fullscreenThumb} ${idx === currentIndex ? styles.active : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`View image ${idx + 1}`}
                                title={`View image ${idx + 1}`}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt || `${title} - ${idx + 1}`}
                                    fill
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>

                    <div className={styles.fullscreenCounter}>
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}

            {/* Grid Modal */}
            {showGrid && (
                <div className={styles.gridModal}>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setShowGrid(false)}
                        aria-label="Close grid"
                        title="Close grid"
                    >
                        <X size={24} />
                    </button>

                    <div className={styles.gridContent}>
                        <h2 className={styles.gridTitle}>All Photos ({images.length})</h2>
                        <div className={styles.gridImages}>
                            {images.map((image, idx) => (
                                <button
                                    key={idx}
                                    className={styles.gridImage}
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        setShowGrid(false);
                                        setShowFullscreen(true);
                                    }}
                                    aria-label={`View image ${idx + 1}`}
                                    title={`View image ${idx + 1}`}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `${title} - ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
