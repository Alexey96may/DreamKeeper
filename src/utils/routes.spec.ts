import { describe, it, expect } from 'vitest';
import { slugify } from './routes'; // Укажите ваш верный путь к файлу

describe('slugify', () => {
    it('транслитерирует кириллицу в латиницу в нижнем регистре', () => {
        expect(slugify('Заброшенный город')).toBe('zabroshennyy-gorod');
        expect(slugify('Разговор у старого маяка')).toBe('razgovor-u-starogo-mayaka');
    });

    it('корректно обрабатывает специфические кириллические символы и мягкий/твёрдый знаки', () => {
        // щ -> sch, ж -> zh, ч -> ch, ш -> sh, ю -> yu, я -> ya
        expect(slugify('Щука и Черепаха')).toBe('schuka-i-cherepaha');
        expect(slugify('Ёж и Жук')).toBe('ezh-i-zhuk');

        // ъ и ь вырезаются (превращаются в '')
        expect(slugify('Объект и Подъезд')).toBe('obekt-i-podezd');
        expect(slugify('Тень и Ночь')).toBe('ten-i-noch');
    });

    it('приводит латиницу и смешанный текст к нижнему регистру', () => {
        expect(slugify('DreamKeeper App')).toBe('dreamkeeper-app');
        expect(slugify('Vue 3 и Vite')).toBe('vue-3-i-vite');
    });

    it('заменяет пробелы, подчеркивания и дефисы на единичный дефис', () => {
        expect(slugify('один   два___три---четыре')).toBe('odin-dva-tri-chetyre');
        expect(slugify('hello_world_test')).toBe('hello-world-test');
    });

    it('удаляет знаки препинания и спецсимволы', () => {
        expect(slugify('Привет, мир! Как дела?')).toBe('privet-mir-kak-dela');
        expect(slugify('Сон №123 (Специальный @выпуск)')).toBe('son-123-spetsialnyy-vypusk');
    });

    it('обрезает пробелы и дефисы по краям строки (trim & strip dashes)', () => {
        expect(slugify('   --Заголовок сна--   ')).toBe('zagolovok-sna');
        expect(slugify('...Тест...')).toBe('test');
    });

    it('корректно обрабатывает пустые строки и строки только из спецсимволов', () => {
        expect(slugify('')).toBe('');
        expect(slugify('   ')).toBe('');
        expect(slugify('!@#$%^&*()')).toBe('');
        expect(slugify('ъь')).toBe('');
    });
});
