export default GS;
declare const GS: EmscriptenModuleFactory<GSEmscriptenModule>

interface GSEmscriptenModule extends EmscriptenModule {
    preInit: Array<{ ({ FS }: { FS: FS }): void }>;
    preRun: Array<{ ({ FS }: { FS: FS }): void }>;
    postRun: Array<{ ({ FS }: { FS: FS }): void }>;
}
