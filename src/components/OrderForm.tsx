import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface OrderFormProps {
  onClose: () => void;
  initialService?: string;
}

const OrderForm = ({ onClose, initialService = '' }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService,
    category: '',
    description: '',
    urgency: 'standard',
    contactMethod: 'email',
    agreedToTerms: false,
    volume: 'small',
    promoCode: '',
    isReturningClient: false
  });
  
  const [promoValidation, setPromoValidation] = useState({ isValid: false, message: '', discount: 0 });

  const services = [
    { value: 'healing', label: 'Лечебные настрои', icon: 'Heart', basePrice: 3000 },
    { value: 'texts', label: 'Создание текстов', icon: 'PenTool', basePrice: 1500 },
    { value: 'poetry', label: 'Стихи и поздравления', icon: 'BookOpen', basePrice: 2000 },
    { value: 'scripts', label: 'Сценарии мероприятий', icon: 'FileText', basePrice: 5000 }
  ];

  const categories = {
    healing: ['Здоровье', 'Отношения', 'Финансы', 'Карьера', 'Духовность', 'Энергия'],
    texts: ['Социальные сети', 'Реклама', 'Блог статьи', 'Коммерческие тексты', 'Презентации'],
    poetry: ['День рождения', 'Свадьба', 'Юбилей', 'Любовная лирика', 'Детские стихи'],
    scripts: ['Корпоратив', 'День рождения', 'Свадьба', 'Выпускной', 'Новый год']
  };

  const volumeOptions = {
    healing: [
      { value: 'small', label: '1 настрой (до 15 мин)', multiplier: 1 },
      { value: 'medium', label: '3 настроя (до 45 мин)', multiplier: 2.5 },
      { value: 'large', label: '5 настроев (до 90 мин)', multiplier: 4 }
    ],
    texts: [
      { value: 'small', label: 'Короткий текст (до 500 слов)', multiplier: 1 },
      { value: 'medium', label: 'Средний текст (до 1500 слов)', multiplier: 2 },
      { value: 'large', label: 'Большой текст (до 3000 слов)', multiplier: 3.5 }
    ],
    poetry: [
      { value: 'small', label: '1 стихотворение', multiplier: 1 },
      { value: 'medium', label: '3-5 стихотворений', multiplier: 2.2 },
      { value: 'large', label: 'Поэтический сборник (10+ стихов)', multiplier: 4 }
    ],
    scripts: [
      { value: 'small', label: 'Короткий сценарий (до 30 мин)', multiplier: 1 },
      { value: 'medium', label: 'Полный сценарий (1-2 часа)', multiplier: 2 },
      { value: 'large', label: 'Развернутый сценарий (3+ часа)', multiplier: 3 }
    ]
  };

  // Система промокодов и скидок
  const promoCodes = {
    'ПЕРВЫЙ10': { discount: 10, description: 'Скидка 10% для новых клиентов' },
    'ЗДОРОВЬЕ15': { discount: 15, description: 'Скидка 15% на лечебные настрои' },
    'ТЕКСТ20': { discount: 20, description: 'Скидка 20% на создание текстов' },
    'ПОСТОЯННЫЙ25': { discount: 25, description: 'Скидка 25% для постоянных клиентов' },
    'ПРАЗДНИК30': { discount: 30, description: 'Праздничная скидка 30%' }
  };
  
  const validatePromoCode = (code: string) => {
    const upperCode = code.toUpperCase().trim();
    if (!upperCode) {
      setPromoValidation({ isValid: false, message: '', discount: 0 });
      return;
    }
    
    const promo = promoCodes[upperCode as keyof typeof promoCodes];
    if (promo) {
      setPromoValidation({ 
        isValid: true, 
        message: promo.description, 
        discount: promo.discount 
      });
    } else {
      setPromoValidation({ 
        isValid: false, 
        message: 'Промокод не найден или недействителен', 
        discount: 0 
      });
    }
  };
  
  const calculatePrice = () => {
    if (!formData.service) return { original: 0, final: 0, savings: 0, discount: 0 };
    
    const service = services.find(s => s.value === formData.service);
    if (!service) return { original: 0, final: 0, savings: 0, discount: 0 };
    
    const volumeOption = volumeOptions[formData.service as keyof typeof volumeOptions]?.find(v => v.value === formData.volume);
    if (!volumeOption) return { original: 0, final: 0, savings: 0, discount: 0 };
    
    let basePrice = service.basePrice * volumeOption.multiplier;
    
    // Добавляем наценку за срочность
    if (formData.urgency === 'fast') {
      basePrice *= 1.5;
    } else if (formData.urgency === 'urgent') {
      basePrice *= 2;
    }
    
    const originalPrice = Math.round(basePrice);
    let totalDiscount = 0;
    
    // Скидка для постоянных клиентов
    if (formData.isReturningClient) {
      totalDiscount += 10;
    }
    
    // Скидка по промокоду
    if (promoValidation.isValid) {
      totalDiscount += promoValidation.discount;
    }
    
    // Максимальная скидка 50%
    totalDiscount = Math.min(totalDiscount, 50);
    
    const finalPrice = Math.round(originalPrice * (1 - totalDiscount / 100));
    const savings = originalPrice - finalPrice;
    
    return { original: originalPrice, final: finalPrice, savings, discount: totalDiscount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Пожалуйста, согласитесь с условиями оказания услуг');
      return;
    }
    
    const pricing = calculatePrice();
    console.log('Заказ отправлен:', { 
      ...formData, 
      pricing: {
        originalPrice: pricing.original,
        finalPrice: pricing.final,
        discount: pricing.discount,
        savings: pricing.savings
      }
    });
    
    let message = `Спасибо за заказ! `;
    if (pricing.savings > 0) {
      message += `Вы экономите ${pricing.savings.toLocaleString()} ₽! `;
    }
    message += `Стоимость к оплате: ${pricing.final.toLocaleString()} ₽. Мы свяжемся с вами в ближайшее время.`;
    
    alert(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Заказать услугу</CardTitle>
            <CardDescription>
              Заполните форму, и мы подготовим персональное предложение
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Личные данные */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Icon name="User" className="mr-2" size={20} />
                Контактная информация
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Выбор услуги */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Icon name="Star" className="mr-2" size={20} />
                Выберите услугу
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <Card 
                    key={service.value}
                    className={`cursor-pointer transition-all ${
                      formData.service === service.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({...formData, service: service.value, category: ''})}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center">
                        <Icon name={service.icon} size={20} className="text-white" />
                      </div>
                      <span className="font-medium">{service.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Категория и объем */}
            {formData.service && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Тематика</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тематику" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[formData.service as keyof typeof categories]?.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Объем работы</Label>
                    <Select value={formData.volume} onValueChange={(value) => setFormData({...formData, volume: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите объем" />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeOptions[formData.service as keyof typeof volumeOptions]?.map((volume) => (
                          <SelectItem key={volume.value} value={volume.value}>{volume.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Описание */}
            <div className="space-y-4">
              <Label htmlFor="description">Подробное описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Опишите ваши пожелания, цели, особенности задачи..."
                rows={4}
                required
              />
            </div>

            {/* Срочность */}
            <div className="space-y-4">
              <Label>Срочность выполнения</Label>
              <RadioGroup 
                value={formData.urgency} 
                onValueChange={(value) => setFormData({...formData, urgency: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Стандартно (5-7 дней)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Быстро (2-3 дня) +50% к стоимости</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent">Срочно (24 часа) +100% к стоимости</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Способ связи */}
            <div className="space-y-4">
              <Label>Предпочтительный способ связи</Label>
              <RadioGroup 
                value={formData.contactMethod} 
                onValueChange={(value) => setFormData({...formData, contactMethod: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-contact" />
                  <Label htmlFor="email-contact">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone-contact" />
                  <Label htmlFor="phone-contact">Телефон</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telegram" id="telegram" />
                  <Label htmlFor="telegram">Telegram</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Скидки и промокоды */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Icon name="Percent" className="mr-2" size={20} />
                Скидки и бонусы
              </h3>
              
              <div className="space-y-4">
                {/* Постоянный клиент */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="returning-client" 
                    checked={formData.isReturningClient}
                    onCheckedChange={(checked) => setFormData({...formData, isReturningClient: !!checked})}
                  />
                  <Label htmlFor="returning-client" className="flex items-center">
                    <Icon name="Star" className="mr-1" size={16} />
                    Я постоянный клиент (скидка 10%)
                  </Label>
                </div>
                
                {/* Промокод */}
                <div className="space-y-2">
                  <Label htmlFor="promo-code">Промокод</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="promo-code"
                      value={formData.promoCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setFormData({...formData, promoCode: code});
                        validatePromoCode(code);
                      }}
                      placeholder="Введите промокод"
                      className={promoValidation.isValid ? 'border-green-500' : 
                               (promoValidation.message && !promoValidation.isValid) ? 'border-red-500' : ''}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => validatePromoCode(formData.promoCode)}
                    >
                      <Icon name="Check" size={16} />
                    </Button>
                  </div>
                  
                  {promoValidation.message && (
                    <p className={`text-sm flex items-center ${
                      promoValidation.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Icon 
                        name={promoValidation.isValid ? "CheckCircle" : "XCircle"} 
                        size={16} 
                        className="mr-1" 
                      />
                      {promoValidation.message}
                    </p>
                  )}
                </div>
                
                {/* Доступные промокоды */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-blue-800">
                    <Icon name="Tag" className="mr-1 inline" size={14} />
                    Доступные промокоды:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700">
                    <div>• ПЕРВЫЙ10 - скидка 10% новым клиентам</div>
                    <div>• ЗДОРОВЬЕ15 - 15% на лечебные настрои</div>
                    <div>• ТЕКСТ20 - 20% на создание текстов</div>
                    <div>• ПОСТОЯННЫЙ25 - 25% постоянным клиентам</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Калькулятор стоимости */}
            {formData.service && (
              <Card className="bg-gradient-to-r from-purple-50 to-green-50 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icon name="Calculator" className="mr-2" size={20} />
                    Расчет стоимости
                  </h3>
                  
                  <div className="space-y-3">
                    {(() => {
                      const pricing = calculatePrice();
                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Базовая стоимость:</span>
                            <span className="font-medium">
                              {services.find(s => s.value === formData.service)?.basePrice.toLocaleString()} ₽
                            </span>
                          </div>
                          
                          {formData.volume !== 'small' && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Объем работы:</span>
                              <span className="font-medium">
                                ×{volumeOptions[formData.service as keyof typeof volumeOptions]?.find(v => v.value === formData.volume)?.multiplier || 1}
                              </span>
                            </div>
                          )}
                          
                          {formData.urgency !== 'standard' && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Срочность:</span>
                              <span className="font-medium text-orange-600">
                                +{formData.urgency === 'fast' ? '50%' : '100%'}
                              </span>
                            </div>
                          )}
                          
                          {pricing.discount > 0 && (
                            <>
                              <div className="border-t pt-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Стоимость до скидки:</span>
                                  <span className="font-medium line-through text-gray-500">
                                    {pricing.original.toLocaleString()} ₽
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 flex items-center">
                                    <Icon name="Percent" className="mr-1" size={16} />
                                    Общая скидка:
                                  </span>
                                  <span className="font-medium text-green-600">
                                    -{pricing.discount}% (-{pricing.savings.toLocaleString()} ₽)
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                          
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold">К оплате:</span>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-purple-600">
                                  {pricing.final.toLocaleString()} ₽
                                </span>
                                {pricing.savings > 0 && (
                                  <div className="text-sm text-green-600 font-medium">
                                    Экономия: {pricing.savings.toLocaleString()} ₽
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              *Окончательная стоимость может быть скорректирована после обсуждения деталей
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Согласие */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: !!checked})}
              />
              <Label htmlFor="terms" className="text-sm">
                Соглашаюсь с условиями оказания услуг и обработкой персональных данных
              </Label>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={!formData.service || calculatePrice().final === 0}>
                <Icon name="Send" className="mr-2" size={16} />
                Отправить заказ {formData.service && `(${calculatePrice().final.toLocaleString()} ₽)`}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;