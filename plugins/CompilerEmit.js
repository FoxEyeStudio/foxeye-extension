class CompilerEmit {
    static innerCompiler;

    apply(compiler) {
        CompilerEmit.innerCompiler = compiler;
    }
}

module.exports = CompilerEmit;
